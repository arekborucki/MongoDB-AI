import { MongoClient } from "mongodb";

// Dane logowania najlepiej trzymać w zmiennej środowiskowej,
// np. uruchamiając: MONGODB_URI="mongodb+srv://user:haslo@cluster.mongodb.net" node app.js
const uri = process.env.MONGODB_URI 
  ?? "mongodb+srv://<user>:<password>@<cluster>.mongodb.net";

async function main() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2
  });

  try {
    // Połączenie z klastrem
    await client.connect();
    console.log("Połączono z MongoDB");

    // Wybranie bazy i kolekcji
    const db = client.db("sample_mflix");
    const movies = db.collection("movies");

    // Odczyt dokumentu
    const movie = await movies.findOne({ title: "The Ring" });
    console.log("Znaleziony dokument:", movie);

    // Wstawianie nowego dokumentu
    const insertResult = await movies.insertOne({
      title: "New Example Movie",
      year: 2025
    });
    console.log("Wstawiono dokument o ID:", insertResult.insertedId);

    // Aktualizacja dokumentu — po _id, żeby na pewno trafić w ten konkretny
    await movies.updateOne(
      { _id: insertResult.insertedId },
      { $set: { year: 2026 } }
    );
    console.log("Zaktualizowano dokument");

    // Usuwanie dokumentu
    await movies.deleteOne({ _id: insertResult.insertedId });
    console.log("Usunięto dokument");

  } catch (error) {
    console.error("Wystąpił błąd podczas pracy aplikacji:", error);
  } finally {
    await client.close();
    console.log("Zamknięto połączenie");
  }
}

main().catch(console.error);
