import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pokédex",
        }}
      />

      <Stack.Screen
        name="details"
        options={{
          title: "Pokémon",
          presentation: "modal",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}