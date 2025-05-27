import { View, Text, Pressable, useColorScheme, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const GREEN = '#27ae60';
const DARK_BG = '#181c1f';
const LIGHT_BG = '#fff';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: DARK_BG }]}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: GREEN }]}>Finly</Text>
      <Text style={[styles.subtitle, { color: '#eee' }]}>
        Welcome to your smart finance companion.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: GREEN, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 18,
    borderRadius: 20,
    backgroundColor: '#222a',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 300,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});