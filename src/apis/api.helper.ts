export async function fetchListOfCharacters(page: number) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json();
    return data;
  } catch (e: any) {
    console.error("Error fetching list:", e.message)
    return null
  }
}

export async function fetchCharacterDetails(id: number) {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (e: any) {
    console.error("Error fetching details:", e.message);
    return null;
  }
}
