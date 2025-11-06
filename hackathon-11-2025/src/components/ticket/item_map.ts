const getRandomName = (names: string | string[]): string => {
  if (typeof names === 'string') {
    return names
  }
  return names[Math.floor(Math.random() * names.length)]
}

export const itemMap = {
  rice: ['Nigiri', 'On Rice'],
  fish: [
    ['Salmon', 'Sake'],
    ['Tamago', 'Egg', 'Japanese Omelet'],
    ['Tuna', 'Maguro', 'Bluefin'],
    ['Whitefish', 'Shiromi', 'Bass'],
    ['Yellowtail', 'Hamachi', 'Kampachi'],
  ],
  garnish: [
    ['Ginger', 'Gari'],
    ['Momiji', 'Red Chili Paste'],
    ['Ume', 'Umeboshi', 'Pickled Plum'],
    ['Wasabi', 'Japanese Horseradish'],
    ['Yuzu Kosho', 'Yuzu', 'Green Chili Paste'],
  ],
  sauce: [
    ['Aioli', 'Mayo'],
    ['Soy Sauce', 'Shoyu'],
    ['Sriracha', 'Hot Sauce', 'Chili Sauce'],
  ],
}

// Helper function to get a name for an item
export const getItemName = (
  category: keyof typeof itemMap,
  index: number,
  hasRice?: boolean,
): string => {
  const item = itemMap[category]

  if (category === 'rice') {
    if (hasRice === true) {
      return getRandomName(item as string | string[])
    }
    return 'Sashimi'
  }

  const itemArray = item as (string | string[])[]
  // Validate index is within bounds
  if (index < 0 || index >= itemArray.length) {
    console.warn(`Invalid index ${index} for category ${category}`)
    return 'Unknown'
  }
  const nameValue = itemArray[index]
  if (!nameValue) {
    console.warn(`No name found at index ${index} for category ${category}`)
    return 'Unknown'
  }
  return getRandomName(nameValue)
}
