import { StyleSheet, View } from 'react-native';

import { Card, Choice, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import type { Cenario } from '@/data/types';

const CENARIOS: { id: Cenario; label: string }[] = [
  { id: 'seco', label: 'Tempo seco' },
  { id: 'previsao', label: '72 h antes' },
  { id: 'confirmado', label: '2 h antes' },
  { id: 'durante', label: 'Durante' },
];

interface Props {
  cenario: Cenario;
  onChange: (c: Cenario) => void;
}

/** Controle de demonstração: alterna o momento do evento de chuva. */
export function CenarioPicker({ cenario, onChange }: Props) {
  return (
    <Card>
      <Text variant="heading" header>
        Simular a chuva
      </Text>
      <Text variant="caption" color="muted">
        Modo demonstração: veja como o app avisa o morador em cada momento.
      </Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {CENARIOS.map((c) => (
          <Choice
            key={c.id}
            variant="chip"
            label={c.label}
            accessibilityLabel={`Simular: ${c.label}`}
            selected={c.id === cenario}
            onPress={() => onChange(c.id)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
});
