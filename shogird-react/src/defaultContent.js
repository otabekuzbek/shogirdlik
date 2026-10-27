// Saytning standart kontenti (asl sahifadagi matnlar).
// Admin panel orqali o'zgartirilgan ma'lumotlar bazada saqlanadi va shu qiymatlarning ustidan yoziladi.
// **qalin matn** — ikkita yulduzcha orasidagi matn qalin ko'rinadi.

export const defaultContent = {
  brand: 'Online Shogirdlik | Abdulloh Ismoilov',
  trainer: 'Abdulloh Ismoilov — fitness trener va murabbiy',
  trainerPhoto: '',
  ctaLink: 'https://t.me/obunaplusbot?start=tariff_125',

  // Bo'sh qoldirsangiz yuqoridagi belgi ko'rinmaydi
  badge: '',

  hero: {
    line1: "Zalga oylab borasiz, lekin tanangiz hali ham eski holatidan o'zgarmayapti.",
    line2: "Chunki sizda plan yo'q.",
    sub: "Nima yeyishni, qancha yeyishni va zalda nima qilishni **aniq** aytib beraman. Har kuni. Taxmin qilib yurmaysiz.",
    cta: "Kanalga qo'shilish →",
    payNote: "Payme · Click · UzumBank — bot orqali, 1 daqiqada.",
  },

  price: {
    // Chegirma va eski narx bo'sh bo'lsa sahifada ko'rinmaydi
    discount: '',
    old: '',
    now: "299 000 so'm",
    period: 'oyiga',
  },

  pain: {
    title: 'Bu sizga tanishmi?',
    items: [
      "Ko'p yeysiz, lekin semirmaysiz. Yoki kam yeysiz, lekin ozmaysiz.",
      'Zalga chiqasiz — nima qilishni bilmay, boshqalarga qarab takrorlaysiz.',
      "Dietani boshlaysiz, 5 kunda tashlab qo'yasiz.",
      "Dobavkaga pul sarflaysiz, lekin kerakmi-yo'qmi bilmaysiz.",
      "Internetda 10 xil maslahat — biri ikkinchisini inkor qiladi.",
      'Oyna oldida turasiz va yana "dushanbadan" deysiz.',
    ],
  },

  survey: {
    title: 'Muammo irodangizda emas',
    intro: "Ko'p odamlardan so'rovnoma o'tkazganimda so'radim: **«Nimaga forma qilolmayapsiz?»**",
    items: [
      { percent: 55, label: "Menda dieta plan yo'q — nima yeyishni bilmayman" },
      { percent: 17, label: 'Zalga chiqqanda nima qilishni bilmayman' },
      { percent: 5, label: "Vaqtim yo'q" },
    ],
    outro:
      "Ya'ni har 10 odamdan 7 tasi **bilmagani uchun** to'xtab qolgan. Dangasaligidan emas. Irodasi yo'qligidan emas.\n**Bilim bo'shlig'ini to'ldirsak — natija o'zi keladi.** Men shu bo'shliqni to'ldiraman.",
  },

  features: {
    title: 'Kanal ichida nima bor',
    items: [
      {
        icon: '🏋️',
        title: 'Kunlik mashqlar',
        text: "Har kuni tayyor mashq dasturi — to'g'ri texnika bilan. Zalga kirasiz va nima qilishni bilasiz. Taxmin yo'q.",
      },
      {
        icon: '🍽️',
        title: 'Dobavka + Ovqatlanish',
        text: "Nima yeyish, qancha yeyish, qachon yeyish. Qaysi dobavka kerak, qaysi biri pul isrofi — ochiq aytaman.",
      },
      {
        icon: '💡',
        title: 'Maslahatlar',
        text: "Ozish va semirish bo'yicha amaliy maslahatlar. Uyqu, rejim, energiya, testosteron — hammasi bir joyda.",
      },
      {
        icon: '📢',
        title: 'Yangiliklar',
        text: "Sohadagi yangiliklar va yangi materiallar. Internetdagi soxta ma'lumotlarni tekshirib beraman.",
      },
    ],
  },

  audience: {
    title: 'Kimlar uchun',
    items: [
      {
        icon: '💪',
        title: 'Semira olmayotganlar',
        text: "Ko'p yeb ham massa yig'ilmayapti. Futbolka osilib turibdi. Muammo genetikada emas — hisobda.",
      },
      {
        icon: '🔥',
        title: 'Oza olmayotganlar',
        text: "Dietani necha marta boshlab tashlagansiz. Och qolmasdan, oddiy ovqat bilan ozish yo'lini ko'rsataman.",
      },
      {
        icon: '🏟️',
        title: "Zalga chiqadigan, lekin natija ko'rmayotganlar",
        text: "Abonementga har oy pul to'laysiz. Nima qilishni bilmasangiz — bu pul kuyadi.",
      },
      {
        icon: '💊',
        title: 'Dobavkaga pul sarflayotganlar',
        text: "Bozorda soxta mahsulot ko'p. Nimaga pul berish kerak, nimaga kerak emas — aniq aytaman.",
      },
    ],
  },

  pricing: {
    title: 'Nima olasiz va qancha turadi',
    lines: [
      { label: "Kunlik mashq dasturi — to'g'ri texnika bilan", value: '~500 000' },
      { label: 'Ovqatlanish tizimi — nima, qancha, qachon', value: '~400 000' },
      { label: "Dobavkalar bo'yicha aniq yo'riqnoma", value: '~300 000' },
      { label: 'Kundalik maslahatlar va yangiliklar', value: '~200 000' },
    ],
    totalLabel: 'Alohida-alohida olsangiz',
    totalValue: "1 400 000 so'm",
    firstLabel: 'Oylik narx',
    firstValue: '299 000',
    foot: "Xohlamasangiz uzaytirmaysiz. **Shartnoma yo'q, majburiyat yo'q.**",
    cta: "299 000 so'mga qo'shilish →",
    note: "Payme · Click · UzumBank — to'lov 1 daqiqada, kanalga darrov kirasiz.",
  },

  cost: {
    title: 'Endi oddiy hisob',
    lead: "Qo'shilmasangiz nima bo'ladi",
    items: [
      "Zal abonementiga oyiga **300 000** to'lashda davom etasiz — lekin nima qilishni bilmay.",
      "Kerak bo'lmagan dobavkaga yana **300–500 ming** ketadi.",
      "Yana bir oy o'tadi. Yana bir yoz o'tadi. Tanangiz o'sha-o'sha.",
      "6 oydan keyin ham xuddi shu sahifani o'qib turgan bo'lasiz — faqat 6 oy kattaroq bo'lib.",
    ],
    quote: "Eng qimmat narsa — 299 000 so'm emas. Eng qimmat narsa — **yana bekorga o'tgan oy.**",
    cta: "Bu oyni bekorga o'tkazmayman →",
  },

  faq: {
    title: "Ko'p so'raladigan savollar",
    items: [
      {
        q: "Menda genetika shunaqa, menga baribir ta'sir qilmaydi",
        a: "Genetika tezlikni belgilaydi, natijani emas. Ikki xil odam bir xil planni bajarsa — biri 3 oyda, ikkinchisi 5 oyda boradi. Lekin ikkalasi ham boradi. Hech qayerga bormaydigan odam — plansiz yurgan odam.",
      },
      {
        q: "YouTube'da bularning hammasi bepul-ku",
        a: "To'g'ri, bepul. Muammo — bir video \"ertalab och qoringa yugur\" deydi, ikkinchisi \"yugurma, mushak yonadi\" deydi. Siz qaysi biri to'g'ri ekanini bilmaysiz. Bu yerda tanlash sizga qolmaydi — tayyor, bir-biriga bog'langan tizim beriladi.",
      },
      {
        q: 'Och qolishim kerakmi?',
        a: "Yo'q. Och qolgan odam 5 kunda tashlab qo'yadi — buni hammamiz ko'rganmiz. Oddiy, topiladigan ovqatlar bilan ishlaymiz. Ochlik emas — hisob.",
      },
      {
        q: "Zalga chiqolmayman, uyda qilsam bo'ladimi?",
        a: "Ovqatlanish qismi zaldan qat'i nazar ishlaydi — natijaning kattaroq qismi ham o'sha yerda. Mashq qismida uy sharoiti uchun variantlar ham beriladi.",
      },
      {
        q: "To'lasam nima bo'ladi?",
        a: "To'lov Payme, Click yoki UzumBank orqali botda amalga oshadi. Shundan keyin yopiq kanalga havola darrov keladi. Bir daqiqalik ish.",
      },
      {
        q: "Bir oydan keyin yoqmasa?",
        a: "Uzaytirmaysiz — tamom. Obuna oylik, hech qanday shartnoma yoki majburiyat yo'q. Xavf tomonda emas, siz tomonda minimal.",
      },
      {
        q: 'Bu 299 000 nimaga arziydi?',
        a: "Bir marta kafega chiqish puli. Farqi shundaki, kafedan 2 soatdan keyin hech narsa qolmaydi — bu yerdan bir oylik tizim qoladi. Va u tizim keyingi yillarga ham qoladi.",
      },
    ],
  },

  final: {
    title: "Ikkita yo'l bor",
    pathA: 'Yana bir oy taxmin qilib yurish.',
    pathB: 'Yoki bugundan aniq plan bilan ishlash.',
    cta: "Hoziroq qo'shilish →",
    note: 'Payme · Click · UzumBank',
  },

  footer: {
    brand: 'Online Shogirdlik | Abdulloh Ismoilov',
    disclaimer:
      "Natija sizning bajarganingizga bog'liq. Surunkali kasallik yoki dori qabul qilayotgan bo'lsangiz — avval shifokoringiz bilan maslahatlashing.",
  },

  stickyCta: "Qo'shilish",
};
