import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View, Image, StyleSheet, Pressable } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20",
      );

      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            types: details.types,
          };
        }),
      );

      setPokemons(detailedPokemons);
    } catch (e) {
      console.log(e);
    }
  }

  function renderPokemon({ item }: { item: Pokemon }) {
    const bgColor = colorsByType[item.types[0].type.name] || "#ccc";

    return (
      <Link
        href={{
          pathname: "/details",
          params: { name: item.name },
        }}
        asChild
      >
        <Pressable
          style={{
            ...styles.card,
            backgroundColor: bgColor + "40",
          }}
        >
          <Image source={{ uri: item.image }} style={styles.image} />

          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.type}>{item.types[0].type.name}</Text>
        </Pressable>
      </Link>
    );
  }

  return (
    <FlatList
      data={pokemons}
      keyExtractor={(item) => item.name}
      renderItem={renderPokemon}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },

  image: {
    width: 90,
    height: 90,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  type: {
    fontSize: 14,
    color: "#555",
    textTransform: "capitalize",
  },
});
