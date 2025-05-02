import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { db } from '../config/firebase';

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

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Nota</Text>
          <View style={styles.ratingContent}>
            <View style={styles.starsContainer}>
              {Array.from({ length: item.rating }, (_, i) => (
                <FontAwesome key={i} name="star" size={16} color="#4CAF50" />
              ))}
              {Array.from({ length: 10 - item.rating }, (_, i) => (
                <FontAwesome key={i} name="star-o" size={16} color="#4CAF50" />
              ))}
            </View>
            <Text style={styles.ratingNumber}>{item.rating}/10</Text>
          </View>
          {item.nickname && (
            <Text style={styles.nickname}>Por: {item.nickname}</Text>
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  list: {
    padding: 20,
  },
  reviewContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  nickname: {
    color: '#666',
    fontSize: 14,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
}); 