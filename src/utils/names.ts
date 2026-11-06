import namesData from '../data/names.json'

export const CULTURES = [
  'cymric_christian',
  'cymric_pagan',
  'saxon_pagan',
  'roman_christian',
  'gaul_christian',
  'pict_heathen',
  'irish_pagan',
] as const
export type Culture = (typeof CULTURES)[number]

export const GENDERS = ['male', 'female'] as const
export type Gender = (typeof GENDERS)[number]

export const TITLES = ['none', 'sir', 'dame', 'lady', 'aethling', 'baron', 'earl', 'duke', 'king'] as const
export type Title = (typeof TITLES)[number]

export const CULTURE_LABELS: Record<Culture, string> = {
  cymric_christian: 'Cymric (Christian)',
  cymric_pagan: 'Cymric (Pagan)',
  saxon_pagan: 'Saxon (Pagan)',
  roman_christian: 'Roman (Christian)',
  gaul_christian: 'Gaul (Christian)',
  pict_heathen: 'Pict (Heathen)',
  irish_pagan: 'Irish (Pagan)',
}

export const GENDER_LABELS: Record<Gender, string> = { male: 'Male', female: 'Female' }

export const TITLE_LABELS: Record<Title, string> = {
  none: 'None',
  sir: 'Sir',
  dame: 'Dame',
  lady: 'Lady',
  aethling: 'Aethling',
  baron: 'Baron',
  earl: 'Earl',
  duke: 'Duke',
  king: 'King',
}

const TITLE_GENDERS: Record<Title, readonly Gender[]> = {
  none: GENDERS,
  sir: ['male'],
  dame: ['female'],
  lady: ['female'],
  aethling: ['male'],
  baron: ['male'],
  earl: ['male'],
  duke: ['male'],
  king: ['male'],
}

export interface NameSettings {
  culture: Culture
  gender: Gender
  title: Title
}

export const DEFAULT_NAME_SETTINGS: NameSettings = { culture: 'cymric_christian', gender: 'male', title: 'none' }

const NAMES = namesData as Partial<Record<Culture, Partial<Record<Gender, string[]>>>>

export const titlesForGender = (gender: Gender): Title[] => TITLES.filter((t) => isTitleAllowed(t, gender))

export const isTitleAllowed = (title: Title, gender: Gender) => TITLE_GENDERS[title].includes(gender)

export const getNames = (culture: Culture, gender: Gender): string[] => NAMES[culture]?.[gender] ?? []

export function pickName(list: string[], previous?: string): string | undefined {
  const filtered = list.filter((n) => n !== previous)
  const pool = filtered.length ? filtered : list
  return pool[Math.floor(Math.random() * pool.length)]
}

export const formatName = (title: Title, name: string) => (title === 'none' ? name : `${TITLE_LABELS[title]} ${name}`)

export function generateName({ culture, gender, title }: NameSettings, previous?: string) {
  const picked = pickName(getNames(culture, gender), previous)
  return picked === undefined ? undefined : { picked, name: formatName(title, picked) }
}
