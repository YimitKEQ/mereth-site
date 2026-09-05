/**
 * The nine holds and the courts that sit them.
 *
 * Three states, and keeping them apart is the whole point of this file:
 *
 *   seated and written    a published name and history
 *   seated, not written   somebody holds it, we simply have no write-up
 *   vacant                the seat is genuinely empty
 *
 * "Filled, details to follow" and "empty, walk in" are opposite facts, and
 * getting them the wrong way round on an official page invites somebody to
 * build a character around a seat that is already somebody else's. Names are
 * transcribed from what the team has published, never inferred: an invented
 * jarl is the fastest way to break another player's roleplay, and an invented
 * steward is the same mistake one rank down.
 *
 * A seat that fills does not erase the jarl who held it. When Falkreath was
 * raised again the obvious edit was to overwrite Kellanved Ultor with his
 * successor, which would have deleted ten years of court history and a
 * proclamation the court published in full. So a succession moves the old jarl
 * to `predecessor` and he stays on the page. The `Vacancy` shape below is kept
 * for the same reason in reverse: no seat is empty today, and the next one will
 * be, so the state stays modelled rather than rewritten from scratch each time.
 */

export interface Hold {
  name: string;
  seat: string;
  /** The court's holder, once the team has published a name. */
  jarl: string | null;
  /** Not every seat is a jarl. Markarth is held by a regent. */
  title?: string;
  /** Why the details are not here yet. Present only while `jarl` is null. */
  pending?: string;
  /** Set only when the seat itself is empty, which is a different fact. */
  vacancy?: Vacancy;
  /** The jarl before this one, kept on the page rather than overwritten. */
  predecessor?: Predecessor;
  /** The jarl, in the words already published. */
  jarlStory: string[];
  /** The hold's own situation. */
  holdStory: string[];
}

/** A jarl who has left the seat, and whose record stays published. */
export interface Predecessor {
  name: string;
  /** How long they held it, short enough for a label. */
  held: string;
  /** How the seat changed hands, in one line. */
  summary: string;
  /** Their write-up, exactly as it read while they sat the seat. */
  story: string[];
  /** Their own words, when the court published a document on the way out. */
  proclamation?: Proclamation;
}

/** An empty seat, and what the hold does until it is filled again. */
export interface Vacancy {
  /** The last holder, named so nobody reads the seat as never having had one. */
  lastHeld: string;
  /** When it emptied, short enough for a label. */
  since: string;
  /** How it emptied, in one line. */
  summary: string;
  /** What holds until a successor is raised. */
  interim: string[];
  /** The departing jarl's own words, published in full. */
  proclamation: Proclamation;
}

/** A document the court published, reproduced rather than summarised. */
export interface Proclamation {
  title: string;
  salutation: string;
  body: string[];
  /** Signature block, one line each, in the order it was signed. */
  signature: string[];
  place: string;
  date: string;
}

export const holds: Hold[] = [
  {
    name: "Haafingar",
    seat: "Solitude",
    jarl: null,
    pending: "Seated. The court has not been written up here yet.",
    jarlStory: [],
    holdStory: [],
  },
  {
    name: "Hjaalmarch",
    seat: "Morthal",
    jarl: "Jarl Calmir Snowhawk",
    jarlStory: [
      `Son of the late Jarl Oslek Snowhawk, groomed for leadership from a young age: studying
        history, politics and the sword while other children played. At eighteen he joined the
        Legion to fight in the Great War alongside Ysroarr Gray-Mane. Disillusioned by the
        White-Gold Concordat, he marched on to Hammerfell before word of his father's disappearance
        brought him home to claim the seat.`,
    ],
    holdStory: [
      `Hjaalmarch needed a fresh start when Calmir returned. His father's mysterious vanishing and
        the toll of the Great War had left the hold uneasy, but Calmir's war experience and lifelong
        preparation helped the people accept him as Jarl, a leader unburdened by the troubles that
        consumed Oslek's final days.`,
    ],
  },
  {
    name: "The Reach",
    seat: "Markarth",
    jarl: null,
    title: "Regent",
    pending: "Held by a regent rather than a jarl. Not written up here yet.",
    jarlStory: [],
    holdStory: [],
  },
  {
    name: "Whiterun Hold",
    seat: "Whiterun",
    jarl: "Jarl Eorlund the Older",
    jarlStory: [
      `Descended from the line of Olaf One-Eye, he rules Whiterun in his advancing years with the
        resolve of a man who has seen too much to flinch. A veteran of the Great War and once part
        of a fabled band of adventurers alongside Parthax Voryndar and Dujek One-Eye, he is no
        stranger to danger or hard decisions.`,
    ],
    holdStory: [
      `Eorlund endeavours to keep his people and their traditions safe from the pressures of
        Cyrodiil. Whiterun will stand as the jewel of Skyrim, a crossroads where all are welcome to
        trade and live, so long as they abide by his rules. Whether the threat comes from friend or
        foe, the Jarl will protect his realm at all costs.`,
    ],
  },
  {
    name: "Falkreath Hold",
    seat: "Falkreath",
    jarl: "Jarl Rigmyr Old-Pelt",
    predecessor: {
      name: "Jarl Kellanved Ultor",
      held: "4E 175 to 4E 185",
      summary: `Kellanved Ultor laid the seat down whole and left Falkreath on pilgrimage. The court
        convened, and it raised his own Housecarl in his place.`,
      story: [
        `Of House Ultor, he ascended in 4E 175 after the sudden death of his father, Jarl Harvok.
          Though the speed of Harvok's illness raised suspicion, Kellanved had already established
          himself as a figure who commanded both respect and fear. Rather than seizing the seat by
          force, he called a local moot, and Falkreath's warriors, priests and landowners confirmed
          him as Jarl.`,
        `Falkreath was fragile when Kellanved took the seat, still reeling from the Great War and
          rising bandit activity along its roads. The hold needed more than a noble; it needed
          someone who could impose order on a land of tombs and timber, where Cyrodiil's highways
          bring as much trouble as trade. Ten years on, that order is what he leaves behind him.`,
      ],
      proclamation: {
        title: "A Proclamation from Jarl Kellanved Ultor of Falkreath",
        salutation: "To the people of Falkreath, and to all sons and daughters of Skyrim,",
        body: [
          `For many years I have carried the weight of this hold upon my shoulders, and I have done
            so gladly. Falkreath is my home, and its people are my blood. But of late the Divines
            have laid a road before me that I can no longer refuse.`,
          `I am called to leave these familiar forests for a time and walk as a pilgrim. I go not in
            search of glory, nor gold, nor war, but wisdom. There are questions in me that no court,
            no council and no throne can answer. I must seek the words of the old and the wise,
            stand before the shrines of the Divines, and learn what sort of man I am when the weight
            of a crown is no longer upon my brow.`,
          `I will not pretend that leaving comes easily. My heart is heavy at the thought of
            departing Falkreath, and heavier still knowing how dearly I will miss its people. Yet a
            man who ignores the call of the Divines cannot rightly claim to follow them.`,
          `So I lay the seat down whole. I do not pass it to a son, nor sell it to a friend, nor keep
            the title on my back while another does the work of it. Falkreath deserves a Jarl who is
            present. Until one is raised, let the court keep the peace, let the law be spoken as I
            spoke it, and let the roads be watched as though I were still stood among you.`,
          `To whoever comes after me: this is a hold of tombs and timber, and it asks patience of
            the living. Guard the roads. Bury the dead with their names said aloud. Take Cyrodiil's
            coin if you must, but never Cyrodiil's leash.`,
          `Do not mourn me. I am not dead, only walking. If the Divines are kind I will come back to
            these pines an older and a quieter man, and ask nothing of you but a bed by the fire and
            the news of how you fared without me.`,
        ],
        signature: ["Kellanved Ultor", "Of House Ultor", "By my last act as your Jarl"],
        place: "Falkreath",
        date: "Last Seed, 4E 185",
      },
    },
    jarlStory: [
      `A stern and deeply traditional Nord whose life has been defined by service, sacrifice and an
        unwavering devotion to the people of Falkreath. Once the Housecarl of Jarl Kellanved, Rigmyr
        served the hold with a quiet loyalty that eventually carried him to the seat itself. He is a
        harsh man by nature, blunt in speech and uncompromising when it comes to cowardice,
        dishonour or betrayal. Yet beneath that severity lies a man who cares fiercely for those
        placed under his protection.`,
      `He is a veteran of the Great War, having fought beneath the banner of the Empire, and it left
        wounds that never truly healed. He watched close friends die in his arms, men he had eaten
        beside, laughed with and trusted with his life. He learned young that war does not care
        about titles or promises, and that every name on a battlefield belongs to someone waiting at
        home.`,
      `Those memories shaped the Jarl he would become. He has little patience for leaders who treat
        their people as numbers or soldiers as expendable, because he remembers what it is to lose
        someone and be unable to do anything about it. He may speak harshly, demand much and expect
        people to carry their responsibilities, but he does so because he believes their lives are
        worth defending.`,
      `He follows Tsun, the Bear, and holds the Old Ways close. To him honour is not a word to be
        spoken when convenient, it is a man's promise when keeping that promise becomes difficult.
        Strength exists to protect the weak, not to prey upon them, and leadership exists to serve
        the people rather than raise the ruler above them.`,
    ],
    holdStory: [
      `On the 23rd of Last Seed, 4E 185, after Kellanved Ultor stepped down, Rigmyr was chosen by
        the court to become Jarl of Falkreath. His ascension marks a return to a harder, older style
        of leadership, one built on tradition, duty and personal responsibility.`,
      `He is a cold man, but not a heartless one. Rigmyr has buried too many friends to take the
        lives of his people lightly. Falkreath is not merely the hold he rules. It is the people he
        swore to protect.`,
    ],
  },
  {
    name: "The Pale",
    seat: "Dawnstar",
    jarl: "Jarl Varinn Whitehawk",
    jarlStory: [
      `A Nord with ancient ties to the Pale. Though the noble blood of Skyrim's kings runs through
        his veins, the harshness of his upbringing afforded him no luxuries: only a life built
        around survival, combat and practical work. As a lesser scion of his clan he was never
        destined for rulership, but life in the frozen north has a way of weeding out the unworthy
        in favour of the exceptional.`,
      `That selection began at thirteen, when fate pitted his longboat against a bull whale, a
        battle won dearly at the cost of a shattered leg. Shallow wounds, as he would call them
        later, ones that did not stop him leading troops into battle at twenty six, nor becoming one
        of Dawnstar's youngest Stewards at thirty.`,
    ],
    holdStory: [
      `In 4E 175 a plague devastated the proud families of the Pale. Faced with precious few worthy
        challengers, Varinn became the natural successor to his grand uncle. The newly appointed
        Jarl spent the next years manoeuvring the beleaguered hold from crisis into rising
        prosperity. Dawnstar now stands as a port city in strategic resurgence, yet politically
        surrounded, and must sail a narrow gauntlet if it is to survive.`,
    ],
  },
  {
    name: "Winterhold",
    seat: "Winterhold",
    jarl: "Jarl Heyth Whitemane",
    jarlStory: [
      `A calm and disciplined Nord whose steady presence anchors a hold with a long history of
        division. Raised inside Winterhold's old traditions, he gave his life to the study of
        Conjuration, drawn to the craft for what it demands of a man, restraint, clarity and
        discipline, rather than for the power it offers. His reputation grew through years of fair
        judgment and patient listening, and it earned him the trust of fisherfolk, scholars and
        soldiers alike. In a place fractured by mistrust between the College and the town, Heyth
        became the rare thing: a mediator who hears every voice before he raises his own.`,
    ],
    holdStory: [
      `Winterhold's glory is long faded. The Great Collapse, the College's looming towers, and the
        Sea of Ghosts gnawing at the broken coast all define a hold caught between ancient pride
        and modern ruin.`,
      `On the 30th of Sun's Height, Heyth Whitemane was named Jarl of Winterhold, a quiet turn but
        a decisive one. Since then he has worked to mend old wounds and pull the hold back toward
        unity, on the belief that honest intention and shared purpose can teach its people to learn
        from one another. Under a measured rule the battered hold stands poised for renewal, led by
        a Jarl whose mastery of the arcane mirrors his mastery of judgment: calm, fair, unwavering.`,
    ],
  },
  {
    name: "Eastmarch",
    seat: "Windhelm",
    jarl: null,
    pending: "Settled at the Moot. Nothing published until it has happened.",
    jarlStory: [],
    holdStory: [],
  },
  {
    name: "The Rift",
    seat: "Riften",
    jarl: "Jarl Vard Fin-Bearer",
    jarlStory: [
      `Born a commoner in Ivarstead, he made his name on reliability and a calm head. As a young man
        he left Skyrim for Cyrodiil and was already there when the Great War began. The
        relationships he built inside the Empire earned him enough trust to lead Legion recruits
        without ever being sworn into the Legion himself.`,
      `He came home to Ivarstead hailed as a hero and did not stop working: policing the land,
        bringing order to the Rift and to the trade routes around it. When he took Fellstar Farm in
        his own town, High King Varic Law-Giver named him Thane, and later took him as Steward. In
        4E 184 Varic died at sea, and his sword was found in the hands of Redguard pirates off High
        Rock.`,
    ],
    holdStory: [
      `No heir to Riften. No High King in Skyrim. Vard stepped forward, and a court of his peers
        found him the undeniable candidate. The seat of the Rift was filled swiftly, and though few
        know the details of that particular moot, nobody disputes the result.`,
      `He rules with order and respect, closer to an Imperial in manner than a Nord, and the hold
        shows it. The Rift is steady, growing, and at peace, with livelihood placed at the
        epicentre of everything Riften does.`,
    ],
  },
];
