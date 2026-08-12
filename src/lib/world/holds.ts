/**
 * The nine holds and the jarls who sit them.
 *
 * Transcribed from the holds map on merethroleplay.com. Four seats are marked
 * TBD there, and they are marked TBD here rather than filled in: an invented
 * jarl is the fastest way to break somebody's roleplay.
 */

export interface Hold {
  name: string;
  seat: string;
  jarl: string | null;
  /** The jarl, in the words already published. */
  jarlStory: string[];
  /** The hold's own situation. */
  holdStory: string[];
}

export const holds: Hold[] = [
  {
    name: "Haafingar",
    seat: "Solitude",
    jarl: null,
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
    jarl: "Jarl Kellanved Ultor",
    jarlStory: [
      `Of House Ultor, he ascended in 4E 175 after the sudden death of his father, Jarl Harvok.
        Though the speed of Harvok's illness raised suspicion, Kellanved had already established
        himself as a figure who commanded both respect and fear. Rather than seizing the seat by
        force, he called a local moot, and Falkreath's warriors, priests and landowners confirmed
        him as Jarl.`,
    ],
    holdStory: [
      `Falkreath was fragile when Kellanved took the seat, still reeling from the Great War and
        rising bandit activity along its roads. The hold needed more than a noble; it needed someone
        who could impose order on a land of tombs and timber, where Cyrodiil's highways bring as
        much trouble as trade.`,
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
    jarl: "Jarl Dujek One-Eye",
    jarlStory: [
      `He traces his lineage, the line of Jorunn, back to the Second Era. Born in 4E 142 to Jarl
        Valdimar, he ascended in 4E 175 after returning from the Great War to find his father dead.
        As the last living son of Valdimar he took the seat with unyielding determination to serve
        his people and uphold Nordic tradition.`,
    ],
    holdStory: [
      `Winterhold's glory is long faded, but its Jarl remembers what it was. The Great Collapse, the
        College's looming towers, and the Sea of Ghosts gnawing at the broken coast all define a
        hold caught between ancient pride and modern ruin.`,
    ],
  },
  {
    name: "Eastmarch",
    seat: "Windhelm",
    jarl: null,
    jarlStory: [],
    holdStory: [],
  },
  {
    name: "The Rift",
    seat: "Riften",
    jarl: null,
    jarlStory: [],
    holdStory: [],
  },
];
