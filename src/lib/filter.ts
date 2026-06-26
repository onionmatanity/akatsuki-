export const ngWords = [
  '死ね',
  '殺す',
  '住所晒す',
  '個人情報売買',
];

export function containsNgWord(text: string) {
  const normalized = text.trim().toLowerCase();
  return ngWords.some((word) => normalized.includes(word.toLowerCase()));
}

export function validateMessageBody(text: string) {
  const body = text.trim();

  if (!body) {
    return '空のメッセージは送信できません。';
  }

  if (body.length > 300) {
    return 'メッセージは300文字以内で入力してください。';
  }

  if (containsNgWord(body)) {
    return '送信できない言葉が含まれています。';
  }

  return null;
}
