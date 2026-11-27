export const CITY_CENTER = { lat: 35.1832, lng: -0.6323 }

export const communeNames = {
  ar: {
    'Sidi Bel Abbès': 'سيدي بلعباس',
    'Aïn El Berd': 'عين البرد',
    Telagh: 'تلاغ',
    'Mostefa Ben Brahim': 'مصطفى بن إبراهيم',
    'Sidi Ali Benyoub': 'سيدي علي بن يوب',
  },
  fr: {
    'Sidi Bel Abbès': 'Sidi Bel Abbès',
    'Aïn El Berd': 'Aïn El Berd',
    Telagh: 'Telagh',
    'Mostefa Ben Brahim': 'Mostefa Ben Brahim',
    'Sidi Ali Benyoub': 'Sidi Ali Benyoub',
  },
}

export function communeLabel(commune, lang) {
  return communeNames[lang]?.[commune] ?? commune
}

export function hashPassword(value) {
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0
  }
  return `dawak$${(hash >>> 0).toString(16)}`
}

const pharmacies = [
  {
    id: 'p1',
    name: 'Pharmacie El Amine',
    name_ar: 'صيدلية الأمين',
    commune: 'Sidi Bel Abbès',
    address: '12 Rue du 19 Mars, Sidi Bel Abbès',
    address_ar: '12 شارع 19 مارس، سيدي بلعباس',
    lat: 35.1832,
    lng: -0.6323,
    phone: '+213 48 55 12 34',
    hours: '08:00 – 20:00',
  },
  {
    id: 'p2',
    name: 'Pharmacie Benbara',
    name_ar: 'صيدلية بن برة',
    commune: 'Sidi Bel Abbès',
    address: '7 Avenue de la République, Sidi Bel Abbès',
    address_ar: '7 شارع الجمهورية، سيدي بلعباس',
    lat: 35.1769,
    lng: -0.6118,
    phone: '+213 48 54 27 90',
    hours: '08:30 – 19:30',
  },
  {
    id: 'p3',
    name: 'Pharmacie Aïn El Berd',
    name_ar: 'صيدلية عين البرد',
    commune: 'Aïn El Berd',
    address: '4 Place du Marché, Aïn El Berd',
    address_ar: '4 ساحة السوق، عين البرد',
    lat: 35.2286,
    lng: -0.7069,
    phone: '+213 48 61 08 55',
    hours: '09:00 – 19:00',
  },
  {
    id: 'p4',
    name: 'Pharmacie Telagh',
    name_ar: 'صيدلية تلاغ',
    commune: 'Telagh',
    address: '21 Rue Principale, Telagh',
    address_ar: '21 الشارع الرئيسي، تلاغ',
    lat: 34.8452,
    lng: -0.6047,
    phone: '+213 48 72 43 11',
    hours: '08:00 – 18:30',
  },
  {
    id: 'p5',
    name: 'Pharmacie Mostefa Ben Brahim',
    name_ar: 'صيدلية مصطفى بن إبراهيم',
    commune: 'Mostefa Ben Brahim',
    address: '3 Route Nationale, Mostefa Ben Brahim',
    address_ar: '3 الطريق الوطني، مصطفى بن إبراهيم',
    lat: 35.5736,
    lng: -0.2394,
    phone: '+213 48 91 16 72',
    hours: '08:00 – 19:00',
  },
]

const medicines = [
  { id: 'm1', brand_name: 'Doliprane', brand_ar: 'دوليبران', dci: 'Paracétamol', dci_ar: 'باراسيتامول', form: 'tablet' },
  { id: 'm2', brand_name: 'Efferalgan', brand_ar: 'إيفرالغان', dci: 'Paracétamol', dci_ar: 'باراسيتامول', form: 'tablet' },
  { id: 'm3', brand_name: 'Amoxicilline', brand_ar: 'أموكسيسيلين', dci: 'Amoxicilline', dci_ar: 'أموكسيسيلين', form: 'capsule' },
  { id: 'm4', brand_name: 'Augmentin', brand_ar: 'أوغمنتين', dci: 'Amoxicilline + Acide clavulanique', dci_ar: 'أموكسيسيلين + حمض الكلافولانيك', form: 'tablet' },
  { id: 'm5', brand_name: 'Metformine', brand_ar: 'ميتفورمين', dci: 'Metformine', dci_ar: 'ميتفورمين', form: 'tablet' },
  { id: 'm6', brand_name: 'Ventoline', brand_ar: 'فنتولين', dci: 'Salbutamol', dci_ar: 'سالبوتامول', form: 'inhaler' },
  { id: 'm7', brand_name: 'Insuline Glargine', brand_ar: 'أنسولين غلارغين', dci: 'Insuline glargine', dci_ar: 'أنسولين غلارغين', form: 'injection' },
  { id: 'm8', brand_name: 'Aspirine', brand_ar: 'أسبرين', dci: 'Acide acétylsalicylique', dci_ar: 'حمض أسيتيل ساليسيليك', form: 'tablet' },
  { id: 'm9', brand_name: 'Ibuprofène', brand_ar: 'إيبوبروفين', dci: 'Ibuprofène', dci_ar: 'إيبوبروفين', form: 'tablet' },
  { id: 'm10', brand_name: 'Oméprazole', brand_ar: 'أوميبرازول', dci: 'Oméprazole', dci_ar: 'أوميبرازول', form: 'capsule' },
  { id: 'm11', brand_name: 'Levothyrox', brand_ar: 'ليفوثيروكس', dci: 'Lévothyroxine', dci_ar: 'ليفوثيروكسين', form: 'tablet' },
  { id: 'm12', brand_name: 'Cétirizine', brand_ar: 'سيتيريزين', dci: 'Cétirizine', dci_ar: 'سيتيريزين', form: 'tablet' },
  { id: 'm13', brand_name: 'Azithromax', brand_ar: 'أزيثروماكس', dci: 'Azithromycine', dci_ar: 'أزيثروميسين', form: 'tablet' },
  { id: 'm14', brand_name: 'Ciprofloxacine', brand_ar: 'سيبروفلوكساسين', dci: 'Ciprofloxacine', dci_ar: 'سيبروفلوكساسين', form: 'tablet' },
  { id: 'm15', brand_name: 'Amlodipine', brand_ar: 'أملوديبين', dci: 'Amlodipine', dci_ar: 'أملوديبين', form: 'tablet' },
  { id: 'm16', brand_name: 'Atorvastatine', brand_ar: 'أتورفاستاتين', dci: 'Atorvastatine', dci_ar: 'أتورفاستاتين', form: 'tablet' },
  { id: 'm17', brand_name: 'Bricanyl', brand_ar: 'بريكانيل', dci: 'Terbutaline', dci_ar: 'تيربوتالين', form: 'inhaler' },
  { id: 'm18', brand_name: 'Nifédipine', brand_ar: 'نيفيديبين', dci: 'Nifédipine', dci_ar: 'نيفيديبين', form: 'tablet' },
  { id: 'm19', brand_name: 'Vitamine D3', brand_ar: 'فيتامين د3', dci: 'Cholécalciférol', dci_ar: 'كوليكالسيفيرول', form: 'ampoule' },
  { id: 'm20', brand_name: 'ORS', brand_ar: 'أور إس', dci: 'Sels de réhydratation orale', dci_ar: 'أملاح الإماهة الفموية', form: 'sachet' },
]

const statusPattern = ['available', 'available', 'low', 'available', 'out', 'low', 'available', 'out']
const minutesPattern = [7, 22, 45, 75, 130, 190, 255, 320, 410, 520]

export function createSeed() {
  const now = Date.now()
  const stocks = []

  pharmacies.forEach((pharmacy, p) => {
    medicines.forEach((medicine, i) => {
      if (medicine.id === 'm20') return
      if (medicine.id === 'm7' && ![0, 2].includes(p)) return
      const minutesAgo = minutesPattern[(i * 5 + p * 3) % minutesPattern.length]
      stocks.push({
        pharmacy_id: pharmacy.id,
        medicine_id: medicine.id,
        status: statusPattern[(i * 3 + p * 5) % statusPattern.length],
        updated_at: now - minutesAgo * 60_000,
        confirmed_by_pharmacist: minutesAgo < 240 && (i + p) % 7 !== 0,
      })
    })
  })

  return {
    lang: 'ar',
    pharmacies,
    medicines,
    stocks,
    alerts: [
      {
        id: 'a-demo-1',
        medicine_id: 'm5',
        contact: '0555 123 456',
        commune: 'Sidi Bel Abbès',
        created_at: now - 25 * 60_000,
        notified_at: null,
      },
      {
        id: 'a-demo-2',
        medicine_id: 'm1',
        contact: 'test@dawak.dz',
        commune: '',
        created_at: now - 9 * 60_000,
        notified_at: null,
      },
    ],
    users: [
      { id: 'u1', pharmacy_id: 'p1', email: 'amine@sba.dz', password_hash: hashPassword('demo1234') },
      { id: 'u2', pharmacy_id: 'p2', email: 'benbara@sba.dz', password_hash: hashPassword('demo1234') },
      { id: 'u3', pharmacy_id: 'p3', email: 'ainelberd@sba.dz', password_hash: hashPassword('demo1234') },
    ],
    feedbacks: [],
    session: null,
    lastFullUpdate: now - 14 * 60_000,
  }
}

export function distanceKm(from, to) {
  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function displayStatus(stock, now = Date.now()) {
  if (!stock) return 'none'
  return now - stock.updated_at > 4 * 60 * 60_000 ? 'stale' : stock.status
}
