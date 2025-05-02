import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';

// Função para normalizar o número de telefone
const normalizePhoneNumber = (phoneNumber: string): string => {
  // Remove todos os caracteres não numéricos
  return phoneNumber.replace(/\D/g, '');
};

interface Review {
  phoneNumber: string;
  rating: number;
  nickname: string;
  text: string;
  date: string;
}

export default function AddReviewScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rating, setRating] = useState(5);
  const [nickname, setNickname] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!phoneNumber.trim() || !text.trim()) {
      alert('Por favor, preencha o número do telefone e o texto da avaliação');
      return;
    }

    setLoading(true);
    const normalizedNumber = normalizePhoneNumber(phoneNumber);

    const newReview: Review = {
      phoneNumber: normalizedNumber,
      rating,
      nickname,
      text,
      date: new Date().toISOString(),
    };

    try {
      // Adiciona a avaliação ao Firestore
      await addDoc(collection(db, 'reviews'), newReview);
      router.push(`/reviews/${normalizedNumber}`);
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Nova Avaliação</Text>
        <Text style={styles.subtitle}>Adicione uma avaliação para um número de telefone</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Número do Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o número do telefone"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nota (0-10)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={rating}
                onValueChange={(value) => setRating(value)}
                style={styles.picker}
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <Picker.Item key={i} label={i.toString()} value={i} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apelido (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu apelido"
              placeholderTextColor="#999"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Avaliação</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite sua avaliação"
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              style={styles.buttonGradient}
            >
              <FontAwesome name="check" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  form: {
    gap: 12,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#333',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
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
  picker: {
    height: 40,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
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
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 