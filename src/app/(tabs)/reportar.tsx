import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { SnapshotBoundary } from '@/components/snapshot-boundary';
import { Button, Choice, Notice, Screen, SectionHeader, Text, useFeedback } from '@/components/ui';
import { categoriaIcon } from '@/constants/categorias';
import { colors, layout, radius, spacing } from '@/constants/theme';
import { categoriaLabel, type CategoriaRelato } from '@/data/types';
import { criarRelato } from '@/services/relatos';
import { useSnapshot } from '@/state/snapshot-context';

const MAX_DESC = 280;
const CATEGORIAS = Object.keys(categoriaLabel) as CategoriaRelato[];

export default function Reportar() {
  const { ruaId: ruaParam } = useLocalSearchParams<{ ruaId?: string }>();
  const { snapshot } = useSnapshot();
  const router = useRouter();
  const { toast } = useFeedback();

  const [ruaEscolhida, setRuaEscolhida] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<CategoriaRelato | null>(null);
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [focado, setFocado] = useState(false);

  // Rua pré-selecionada vinda do detalhe da rua, até o usuário escolher outra.
  const ruaId = ruaEscolhida ?? ruaParam ?? null;

  const passo = !ruaId ? 1 : !categoria ? 2 : 3;
  const podeEnviar = !!ruaId && !!categoria && !salvando;

  async function enviar() {
    const rua = snapshot?.ruas.find((r) => r.id === ruaId);
    if (!rua || !categoria) return;
    setSalvando(true);
    try {
      const { enviado } = await criarRelato({
        ruaId: rua.id,
        ruaNome: rua.nome,
        categoria,
        descricao: descricao.trim().slice(0, MAX_DESC),
      });
      setRuaEscolhida(null);
      setCategoria(null);
      setDescricao('');
      router.setParams({ ruaId: undefined });
      toast(
        enviado
          ? { tone: 'success', title: 'Relato enviado', message: 'Obrigado! Isso ajuda a priorizar a limpeza.' }
          : { tone: 'warning', title: 'Relato salvo no celular', message: 'Sem conexão agora. Ele ficou pendente em “Meus relatos”.' },
      );
      router.navigate('/relatos');
    } catch {
      toast({ tone: 'danger', title: 'Não foi possível salvar', message: 'Tente novamente em instantes.' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Screen narrow>
      <Notice tone="info" icon="shield-checkmark" title="Sua privacidade">
        Não informe dados pessoais. O relato fala só da rua e do problema.
      </Notice>

      <SnapshotBoundary>
        {(s) => (
          <>
            <Text variant="caption" color="muted" accessibilityLiveRegion="polite">
              Passo {passo} de 3
            </Text>

            <View style={styles.group}>
              <SectionHeader title="1. Qual rua?" />
              <View style={styles.options} accessibilityRole="radiogroup">
                {s.ruas.map((r) => (
                  <Choice key={r.id} label={r.nome} icon="location-outline" selected={ruaId === r.id} onPress={() => setRuaEscolhida(r.id)} />
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <SectionHeader title="2. O que você viu?" />
              <View style={styles.options} accessibilityRole="radiogroup">
                {CATEGORIAS.map((c) => (
                  <Choice key={c} label={categoriaLabel[c]} icon={categoriaIcon[c]} selected={categoria === c} onPress={() => setCategoria(c)} />
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <SectionHeader title="3. Quer contar mais?" subtitle="Opcional" />
              <TextInput
                value={descricao}
                onChangeText={(t) => setDescricao(t.slice(0, MAX_DESC))}
                onFocus={() => setFocado(true)}
                onBlur={() => setFocado(false)}
                multiline
                placeholder="Ex.: lixo acumulado perto da esquina"
                placeholderTextColor={colors.textSubtle}
                accessibilityLabel="Descrição do problema, opcional"
                style={[styles.input, focado && styles.inputFocus]}
              />
              <Text variant="caption" color="subtle" style={styles.counter}>
                {descricao.length}/{MAX_DESC}
              </Text>
            </View>

            <Button
              label="Enviar relato"
              icon="paper-plane"
              onPress={enviar}
              disabled={!podeEnviar}
              loading={salvando}
              hint={podeEnviar ? undefined : 'Escolha a rua e o tipo de problema primeiro'}
            />
            {!podeEnviar && !salvando && (
              <Text variant="caption" color="muted" style={styles.helper}>
                Escolha a rua e o tipo de problema para enviar.
              </Text>
            )}
          </>
        )}
      </SnapshotBoundary>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.md },
  options: { gap: spacing.sm },
  input: {
    minHeight: 112,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    minWidth: layout.touch,
  },
  inputFocus: { borderColor: colors.primary },
  counter: { textAlign: 'right' },
  helper: { textAlign: 'center' },
});
