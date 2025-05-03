import { Text } from '@/components/Themed';
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
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push(`/reviews/${normalizedNumber}`);
      }, 500);
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
        colors={['#6C47FF', '#4F8CFF']}
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
              placeholderTextColor="#888"
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
              placeholder="Digite um apelido"
              placeholderTextColor="#888"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Avaliação</Text>
            <TextInput
              style={[styles.input, { height: 48 }]}
              placeholder="Digite sua avaliação"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={120}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={['#6C47FF', '#4F8CFF']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Avaliação'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {success && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Avaliação registrada com sucesso!</Text>
            </View>
          )}
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
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 12,
    marginTop: 0,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6C47FF',
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: '#6C47FF',
    color: '#22223B',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6C47FF',
    marginTop: 2,
  },
  picker: {
    color: '#22223B',
    fontFamily: 'Inter_400Regular',
    height: 32,
    width: '100%',
  },
  button: {
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  successContainer: {
    marginTop: 10,
    backgroundColor: '#FFEBB7',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
}); 