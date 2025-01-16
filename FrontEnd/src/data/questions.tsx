const questionsData = [
    {
      "question": "Koja je glavna šteta izazvana zagađenjem vazduha?",
      "options": ["Oštećenje ozonskog sloja", "Povećanje temperature", "Zagađenje reka", "Oštećenje zemljišta"],
      "correctAnswer": "Povećanje temperature"
    },
    {
      "question": "Koji materijal se najčešće reciklira?",
      "options": ["Papir", "Plastika", "Staklo", "Guma"],
      "correctAnswer": "Papir"
    },
    {
      "question": "Koji je najveći izvor zagađenja u gradovima?",
      "options": ["Fabrike", "Automobili", "Poljoprivreda", "Otpad"],
      "correctAnswer": "Automobili"
    },
    {
      "question": "Šta je 'održivi razvoj'?",
      "options": ["Razvoj koji koristi neobnovljive resurse", "Razvoj bez negativnog uticaja na okolinu", "Razvoj koji povećava zagađenje", "Razvoj bez zaštite prirode"],
      "correctAnswer": "Razvoj bez negativnog uticaja na okolinu"
    },
    {
      "question": "Koja je najveća opasnost od plastičnog otpada?",
      "options": ["Zagađenje zemljišta", "Ugrožavanje morskih ekosistema", "Zagađenje vazduha", "Povećanje temperature"],
      "correctAnswer": "Ugrožavanje morskih ekosistema"
    },
    {
      "question": "Koje vrste energije smatraju se obnovljivim izvorima energije?",
      "options": ["Nafta", "Solarna energija", "Gas", "Ugljen"],
      "correctAnswer": "Solarna energija"
    },
    {
      "question": "Zašto je važno saditi drveće?",
      "options": ["Za proizvodnju kiseonika", "Za zaštitu od poplava", "Za smanjenje buke", "Sve od navedenog"],
      "correctAnswer": "Sve od navedenog"
    },
    {
      "question": "Šta je kompostiranje?",
      "options": ["Proces razgradnje plastičnog otpada", "Proces razgradnje organskog otpada", "Proces reciklaže stakla", "Proces proizvodnje bio-plastike"],
      "correctAnswer": "Proces razgradnje organskog otpada"
    },
    {
      "question": "Koji je najbolji način za smanjenje upotrebe plastike?",
      "options": ["Korišćenjem ekoloških torbi", "Korišćenjem više plastičnih flaša", "Odlaganjem otpada u prirodi", "Nema rešenja"],
      "correctAnswer": "Korišćenjem ekoloških torbi"
    },
    {
      "question": "Koja životinja je najugroženija zbog zagađenja okeana?",
      "options": ["Kitovi", "Pingvini", "Kornjače", "Delfini"],
      "correctAnswer": "Kornjače"
    },
    {
      "question": "Šta je ekološki otisak?",
      "options": ["Mera za količinu generisanog otpada", "Mera za količinu ugljen-dioksida u vazduhu", "Mera za količinu resursa potrebnih za zadovoljenje ljudskih potreba", "Mera za količinu prozvodnje hrane"],
      "correctAnswer": "Mera za količinu resursa potrebnih za zadovoljenje ljudskih potreba"
    },
    {
      "question": "Zašto je važno reciklirati papir?",
      "options": ["Da bi se smanjila potrošnja drveta", "Da bi se smanjila količina stakla", "Da bi se smanjila potrošnja plastike", "Da bi se smanjila emisija ugljen-dioksida"],
      "correctAnswer": "Da bi se smanjila potrošnja drveta"
    },
    {
      "question": "Koja životinja je simbol za očuvanje biodiverziteta?",
      "options": ["Panda", "Slon", "Lav", "Sova"],
      "correctAnswer": "Panda"
    },
    {
      "question": "Koji je cilj smanjenja potrošnje energije?",
      "options": ["Smanjenje ugljen-dioksida", "Smanjenje buke", "Povećanje brzine proizvodnje", "Povećanje emisije gasova"],
      "correctAnswer": "Smanjenje ugljen-dioksida"
    },
    {
      "question": "Koja je prednost upotrebe LED sijalica?",
      "options": ["Veća potrošnja energije", "Manja potrošnja energije", "Veća emisija ugljen-dioksida", "Manja emisija ugljen-dioksida"],
      "correctAnswer": "Manja potrošnja energije"
    },
    {
      "question": "Koja od sledećih životinja je najugroženija zbog krivolova?",
      "options": ["Tigar", "Panda", "Nosorog", "Svi odgovor"],
      "correctAnswer": "Svi odgovor"
    },
    {
      "question": "Kako se naziva proces pretvaranja otpada u nove proizvode?",
      "options": ["Recycling", "Upcycling", "Downcycling", "Composting"],
      "correctAnswer": "Recycling"
    },
    {
      "question": "Koja vrsta energije je najpovoljnija za životnu sredinu?",
      "options": ["Solarna energija", "Ugljen", "Nuklearna energija", "Nafta"],
      "correctAnswer": "Solarna energija"
    },
    {
      "question": "Koja je posledica masovne seče šuma?",
      "options": ["Smanjenje ugljen-dioksida", "Gubitak biodiverziteta", "Obnavljanje zemljišta", "Povećanje broja biljaka"],
      "correctAnswer": "Gubitak biodiverziteta"
    },
    {
      "question": "Šta znači pojam 'zelena energija'?",
      "options": ["Energija koja se koristi za svesnu zaštitu životne sredine", "Energija dobijena iz obnovljivih izvora", "Energija koja koristi nuklearne resurse", "Energija dobijena iz fosilnih goriva"],
      "correctAnswer": "Energija dobijena iz obnovljivih izvora"
    },
    {
      "question": "Kako najviše možemo doprineti očuvanju planete?",
      "options": ["Smanjenjem potrošnje energije", "Sadnjom drveća", "Recikliranjem", "Sve od navedenog"],
      "correctAnswer": "Sve od navedenog"
    },
    {
      "question": "Koji je najvažniji cilj smanjenja emisije ugljen-dioksida?",
      "options": ["Smanjenje globalnog zagrevanja", "Smanjenje zagađenja voda", "Povećanje proizvodnje hrane", "Povećanje broja biljaka"],
      "correctAnswer": "Smanjenje globalnog zagrevanja"
    },
    {
      "question": "Koje je najefikasnije sredstvo za smanjenje zagađenja?",
      "options": ["Pravilno odlaganje otpada", "Smanjenje potrošnje plastike", "Zeleni transport", "Svi od navedenih"],
      "correctAnswer": "Svi od navedenih"
    },
    {
      "question": "Koja je glavna uloga ozonskog sloja?",
      "options": ["Zaštita od UV zračenja", "Zaštita od zagađenja", "Zadržavanje ugljen-dioksida", "Zadržavanje kiseonika"],
      "correctAnswer": "Zaštita od UV zračenja"
    },
    {
      "question": "Šta je glavni uzrok globalnog zagrevanja?",
      "options": ["Smanjena proizvodnja hrane", "Povećanje emisije CO2", "Povećanje broja životinja", "Povećanje broja biljaka"],
      "correctAnswer": "Povećanje emisije CO2"
    },
    {
      "question": "Koji su najvažniji izvori vode za pijanje?",
      "options": ["Reke", "Jezera", "Podzemne vode", "Svi od navedenih"],
      "correctAnswer": "Svi od navedenih"
    }
  ];


// Function to shuffle and pick 10 random questions
function getRandomQuestions(questionsArray, numQuestions) {
    const shuffledQuestions = [...questionsArray].sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, numQuestions);
}

const randomQuestions = getRandomQuestions(questionsData, 5);

export default randomQuestions;
