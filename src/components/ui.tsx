import { ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export const colors = {
  violet: '#6D4AFF', pressed: '#5937E5', soft: '#F0ECFF', canvas: '#F8F7FC',
  text: '#1F1B2D', muted: '#716B7A', border: '#E8E4F0', white: '#FFFFFF', success: '#2E9D74',
};

export function Page({ title, subtitle, children, step }: { title: string; subtitle: string; children: ReactNode; step?: string }) {
  return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><ScrollView contentContainerStyle={styles.page}>
    <Text style={step ? styles.step : styles.brand}>{step ?? 'Wigo.'}</Text>
    <Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text>
    <View style={styles.content}>{children}</View>
  </ScrollView></SafeAreaView>;
}

export function PrimaryButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.primary, disabled && styles.disabled]}><Text style={styles.primaryText}>{label} →</Text></Pressable>;
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.secondary}><Text style={styles.secondaryText}>{label}</Text></Pressable>;
}

export function Card({ title, text, action, onPress }: { title: string; text: string; action?: string; onPress?: () => void }) {
  return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardText}>{text}</Text>{action && onPress ? <Pressable onPress={onPress}><Text style={styles.link}>{action}</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas }, page: { flexGrow: 1, padding: 24, paddingBottom: 38 },
  brand: { color: colors.violet, fontSize: 18, fontWeight: '800', marginBottom: 34 }, step: { color: colors.violet, fontSize: 14, fontWeight: '800', marginBottom: 34 },
  title: { color: colors.text, fontSize: 31, fontWeight: '800', letterSpacing: -0.8 }, subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginTop: 10 }, content: { gap: 14, marginTop: 30 },
  primary: { alignItems: 'center', backgroundColor: colors.violet, borderRadius: 15, justifyContent: 'center', minHeight: 56, paddingHorizontal: 18 }, primaryText: { color: colors.white, fontSize: 16, fontWeight: '800' }, disabled: { backgroundColor: '#B9AFDF' },
  secondary: { alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 15, borderWidth: 1, justifyContent: 'center', minHeight: 56, paddingHorizontal: 18 }, secondaryText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  card: { backgroundColor: colors.white, borderColor: colors.border, borderRadius: 20, borderWidth: 1, padding: 18 }, cardTitle: { color: colors.text, fontSize: 18, fontWeight: '800' }, cardText: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 4 }, link: { color: colors.violet, fontSize: 14, fontWeight: '800', marginTop: 12 },
});

export const ui = styles;
