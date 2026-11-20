const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export function conversationFilter(query: string) {
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (!words.length) return undefined
  return (conversation: { id: number; title?: string }, feature?: string) => {
    const text = fold(`${conversation.title ?? ''} #${conversation.id} ${feature ?? ''}`)
    return words.every((word) => text.includes(word))
  }
}
