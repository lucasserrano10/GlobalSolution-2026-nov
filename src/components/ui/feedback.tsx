import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors, layout, radius, shadow, spacing, toneStyle, type Tone } from '@/constants/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ToastInput {
  tone: Extract<Tone, 'success' | 'danger' | 'info' | 'warning'>;
  title: string;
  message?: string;
}

interface ConfirmInput {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface FeedbackApi {
  toast: (t: ToastInput) => void;
  confirm: (c: ConfirmInput) => Promise<boolean>;
}

const Ctx = createContext<FeedbackApi | null>(null);

const TOAST_MS = 4000;
const toastIcon: Record<ToastInput['tone'], IconName> = {
  success: 'checkmark-circle',
  danger: 'warning',
  info: 'information-circle',
  warning: 'alert-circle',
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toastData, setToastData] = useState<(ToastInput & { id: number }) | null>(null);
  const [dialog, setDialog] = useState<ConfirmInput | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((t: ToastInput) => {
    if (timer.current) clearTimeout(timer.current);
    setToastData({ ...t, id: Date.now() });
    AccessibilityInfo.announceForAccessibility(t.message ? `${t.title}. ${t.message}` : t.title);
    timer.current = setTimeout(() => setToastData(null), TOAST_MS);
  }, []);

  const confirm = useCallback(
    (c: ConfirmInput) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setDialog(c);
      }),
    [],
  );

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setDialog(null);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const api = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <ToastView data={toastData} onDismiss={() => setToastData(null)} />
      <Modal visible={!!dialog} transparent animationType="fade" onRequestClose={() => close(false)} statusBarTranslucent>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => close(false)} accessibilityLabel="Fechar" accessibilityRole="button" />
          {dialog && (
            <View style={styles.dialog} accessibilityViewIsModal>
              <Text variant="title" header>
                {dialog.title}
              </Text>
              <Text color="muted">{dialog.message}</Text>
              <View style={styles.actions}>
                <Button
                  label={dialog.confirmLabel}
                  variant={dialog.destructive ? 'danger' : 'primary'}
                  onPress={() => close(true)}
                />
                <Button label={dialog.cancelLabel ?? 'Cancelar'} variant="secondary" onPress={() => close(false)} />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

function ToastView({ data, onDismiss }: { data: (ToastInput & { id: number }) | null; onDismiss: () => void }) {
  if (!data) return null;
  // `key` remonta o toast a cada novo aviso, reiniciando a animação de entrada.
  return <ToastBody key={data.id} data={data} onDismiss={onDismiss} />;
}

function ToastBody({ data, onDismiss }: { data: ToastInput; onDismiss: () => void }) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: reduced ? 0 : 220, useNativeDriver: true }).start();
  }, [anim, reduced]);

  const t = toneStyle[data.tone];

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.toastWrap,
        { top: insets.top + spacing.sm, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] },
      ]}>
      <Pressable
        onPress={onDismiss}
        accessibilityRole="alert"
        accessibilityLabel={`${data.title}. ${data.message ?? ''} Toque para fechar.`}
        style={[styles.toast, { backgroundColor: t.bg, borderColor: t.border }]}>
        <Icon name={toastIcon[data.tone]} size={22} color={t.fg} />
        <View style={styles.toastText}>
          <Text variant="bodyStrong" style={{ color: t.fg }}>
            {data.title}
          </Text>
          {data.message && (
            <Text variant="caption" style={{ color: t.fg }}>
              {data.message}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function useFeedback(): FeedbackApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFeedback deve ser usado dentro de FeedbackProvider');
  return v;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.raised,
  },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  toastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: spacing.lg },
  toast: {
    width: '100%',
    maxWidth: layout.narrowWidth,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    ...shadow.raised,
  },
  toastText: { flex: 1, gap: 2 },
});
