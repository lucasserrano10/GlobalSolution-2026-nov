import { StyleSheet, View } from 'react-native';

import { Badge, Button, Card, Icon, Text } from '@/components/ui';
import { categoriaIcon } from '@/constants/categorias';
import { colors, radius, spacing } from '@/constants/theme';
import { categoriaLabel, type Relato } from '@/data/types';
import { formatDataHora } from '@/utils/format';

interface Props {
  relato: Relato;
  onReenviar: () => void;
  onExcluir: () => void;
  reenviando?: boolean;
}

export function RelatoCard({ relato, onReenviar, onExcluir, reenviando }: Props) {
  const pendente = relato.status === 'pendente';

  return (
    <Card>
      <View style={styles.head}>
        <View style={styles.iconWrap}>
          <Icon name={categoriaIcon[relato.categoria]} size={22} color={colors.primary} />
        </View>
        <View style={styles.headText}>
          <Text variant="heading">{categoriaLabel[relato.categoria]}</Text>
          <Text variant="caption" color="muted">
            {relato.ruaNome} · {formatDataHora(relato.criadoEm)}
          </Text>
        </View>
      </View>

      {!!relato.descricao && <Text color="muted">{relato.descricao}</Text>}

      <Badge
        label={pendente ? 'Pendente de envio' : 'Enviado'}
        tone={pendente ? 'warning' : 'success'}
        icon={pendente ? 'time-outline' : 'checkmark-circle'}
      />

      <View style={styles.actions}>
        {pendente && <Button label="Enviar agora" icon="paper-plane" onPress={onReenviar} loading={reenviando} />}
        <Button label="Excluir" variant="ghost" icon="trash-outline" onPress={onExcluir} hint="Apaga este relato do celular" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: { flex: 1 },
  actions: { gap: spacing.xs, marginTop: spacing.sm },
});
