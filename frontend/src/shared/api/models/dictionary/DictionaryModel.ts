export type DictionaryModel = {
  header: Record<string, unknown>; // Заголовок, пустой объект
  def: DictionaryEntry[]; // Массив словарных статей
};

type DictionaryEntry = {
  pos?: string; // Часть речи, может быть не указана
  ts: string; // Транскрипция слова
  text: string; // Само слово
  tr: Translation[]; // Массив переводов
};

type Translation = {
  text: string; // Перевод
  pos?: string; // Часть речи перевода, может быть не указана
  gen?: string; // Род существительного, может быть не указан
  syn?: Synonym[]; // Массив синонимов
  mean?: Meaning[]; // Массив значений
  ex?: Example[]; // Массив примеров
};

type Synonym = {
  text: string; // Текст синонима
};

type Meaning = {
  text: string; // Значение
};

type Example = {
  text: string; // Пример использования
  tr: { text: string }; // Перевод примера
};
