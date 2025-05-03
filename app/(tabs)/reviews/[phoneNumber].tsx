import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, View } from 'react-native';
import { db } from '../../config/firebase';

interface Review {
  id: string;
  phoneNumber: string;
  rating: number;
  nickname: string;
  text: string;
  date: string;
}

export default function ReviewsScreen() {
  const { phoneNumber } = useLocalSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Busca as avaliações no Firestore
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('phoneNumber', '==', phoneNumber)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];

        setReviews(reviewsData);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [phoneNumber]);

  const getCardColor = (rating: number) => {
    if (rating >= 9) return { backgroundColor: '#F3F0FF', borderColor: '#6C47FF' };
    if (rating >= 6) return { backgroundColor: '#FFF9E5', borderColor: '#FF9800' };
    return { backgroundColor: '#FFF0F0', borderColor: '#FF5A5F' };
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={[styles.reviewContainer, getCardColor(item.rating)]}>
      <View style={styles.reviewHeader}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Nota: <Text style={styles.ratingNumber}>{item.rating}</Text></Text>
          <View style={styles.ratingContent}>
            <View style={styles.starsContainer}>
              {Array.from({ length: item.rating }, (_, i) => (
                <Image
                  key={i}
                  source={require('../../../assets/icons/star.png')}
                  style={{ width: 18, height: 18, marginRight: 2 }}
                  resizeMode="contain"
                />
              ))}
            </View>
          </View>
          {item.nickname && (
            <Text style={styles.nickname}>Apelido: {item.nickname}</Text>
          )}
        </View>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Avaliações</Text>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Carregando...</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="comment-o" size={50} color="#CCCCCC" />
          <Text style={styles.emptyText}>Nenhuma avaliação encontrada</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223B',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#6C47FF',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  list: {
    padding: 20,
  },
  reviewContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ratingContainer: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223B',
    fontFamily: 'Inter_700Bold',
    marginBottom: 5,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C47FF',
    fontFamily: 'Inter_700Bold',
  },
  nickname: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  date: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  reviewText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#22223B',
    fontFamily: 'Inter_400Regular',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Inter_400Regular',
    marginTop: 12,
    textAlign: 'center',
  },
}); 