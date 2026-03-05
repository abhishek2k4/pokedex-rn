import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;

  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
  };

  types: {
    slot: number;
    type: { name: string };
  }[];

  abilities: {
    ability: { name: string };
  }[];

  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
};

export default function Details() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) loadPokemon(name);
  }, [name]);

  async function loadPokemon(pokemonName: string) {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );

      const data = await res.json();
      setPokemon(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!pokemon) {
    return <Text>Pokemon not found</Text>;
  }

  const sprites = [
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER */}
      <Text style={styles.name}>
        {pokemon.name} #{pokemon.id}
      </Text>

      {/* IMAGE GALLERY */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sprites.map((sprite, index) =>
          sprite ? (
            <Image key={index} source={{ uri: sprite }} style={styles.sprite} />
          ) : null
        )}
      </ScrollView>

      {/* TYPES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types</Text>

        <View style={styles.typeRow}>
          {pokemon.types.map((t) => (
            <View key={t.slot} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* BASIC INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{pokemon.height}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{pokemon.weight}</Text>
          </View>
        </View>
      </View>

      {/* ABILITIES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abilities</Text>

        {pokemon.abilities.map((a, index) => (
          <Text key={index} style={styles.ability}>
            • {a.ability.name}
          </Text>
        ))}
      </View>

      {/* STATS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>

        {pokemon.stats.map((s, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>

            <View style={styles.statBarBackground}>
              <View
                style={[
                  styles.statBar,
                  { width: `${(s.base_stat / 150) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 25,
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
  },

  sprite: {
    width: 120,
    height: 120,
    marginRight: 12,
  },

  section: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  typeRow: {
    flexDirection: "row",
    gap: 10,
  },

  typeBadge: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  typeText: {
    textTransform: "capitalize",
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    gap: 20,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 12,
    color: "gray",
  },

  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  ability: {
    fontSize: 16,
    textTransform: "capitalize",
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statName: {
    width: 70,
    textTransform: "capitalize",
  },

  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },

  statBar: {
    height: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },

  statValue: {
    width: 35,
    textAlign: "right",
  },
});