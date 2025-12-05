/**
 * Hierarchical Event Structure
 * Solves density problem through curated multi-level drill-down
 *
 * Design Principles:
 * - Max 5-10 events visible at any level
 * - Ancient eras: 1-2 drill-down levels (sparse)
 * - Modern eras: 3-4 drill-down levels (dense)
 * - Progressive disclosure prevents overwhelming users
 */

import type { TimelineEventState } from "@/types";

export interface HierarchicalEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  era: string;
  tags: string[];
  difficulty: number;
  state: TimelineEventState;
  hierarchyLevel: number; // 0 = top level, 1 = first drill-down, etc.
  parentEventId: string | null; // Event that "owns" this in hierarchy
  isKeyEvent: boolean; // Shown at parent level
  weight: number; // Visual weight for segment distribution (0.1-10, default 1)
  content: {
    story: string;
    funFacts: string[];
    triggers: {
      story?: {
        content: string;
        images?: string[];
      };
      game?: {
        placeholder: string;
        previewDescription?: string;
      };
      related?: {
        items: Array<{
          id: string;
          name: string;
          description: string;
          year?: number;
        }>;
      };
    };
  };
}

/**
 * LEVEL 0: Top-level milestones (shown initially)
 * 6 major events spanning all human history
 */
export const topLevelEvents: HierarchicalEvent[] = [
  {
    id: "evt-top-001",
    title: "The Wheel",
    description: "Revolutionary invention that transformed transportation and mechanics.",
    year: -3500,
    era: "ancient",
    tags: ["invention", "innovation"],
    difficulty: 1,
    state: "safe",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 4, // Ancient events get more space
    content: {
      story: "The wheel changed everything - from moving heavy stones to creating pottery.",
      funFacts: [
        "Invented around 3500 BCE in Mesopotamia",
        "Early wheels were solid wood slices",
        "Took 300 years to put wheels on chariots"
      ],
      triggers: {
        story: {
          content: "Around 3500 BCE in Mesopotamia, someone realized a rolling log could become something more...",
          images: ["/images/ancient-wheel.jpg"]
        },
        related: {
          items: [
            { id: "evt-l1-002", name: "Great Pyramids", description: "Built mostly without wheels", year: -2560 }
          ]
        }
      }
    }
  },
  {
    id: "evt-top-002",
    title: "The Printing Press",
    description: "Gutenberg's invention democratized knowledge and sparked the Renaissance.",
    year: 1450,
    era: "renaissance",
    tags: ["innovation", "culture"],
    difficulty: 2,
    state: "attacked",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 2, // Renaissance gets moderate space
    content: {
      story: "The printing press made books affordable and spread ideas faster than ever before.",
      funFacts: [
        "First major book printed: the Gutenberg Bible (1455)",
        "Before printing, books were hand-copied by monks",
        "Sparked the Protestant Reformation and Scientific Revolution"
      ],
      triggers: {
        story: {
          content: "Johannes Gutenberg combined existing technologies in a new way: movable type, oil-based ink, and a modified wine press...",
        },
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-top-003",
    title: "The Steam Engine",
    description: "Powered the Industrial Revolution and transformed society.",
    year: 1776,
    era: "industrial",
    tags: ["innovation", "science"],
    difficulty: 2,
    state: "threatened",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 1.5, // Industrial gets moderate space
    content: {
      story: "James Watt's improvements to the steam engine powered factories, trains, and ships.",
      funFacts: [
        "The first steam engines were used to pump water out of mines",
        "Steam trains could travel 30 mph - faster than any horse",
        "Steam power freed factories from needing to be near rivers"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-top-004",
    title: "The Airplane",
    description: "Wright Brothers achieved powered flight, shrinking the world.",
    year: 1903,
    era: "modern",
    tags: ["innovation", "science"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 0.7, // Early modern gets less space
    content: {
      story: "On December 17, 1903, Orville Wright flew 120 feet in 12 seconds - humanity's first powered flight.",
      funFacts: [
        "The first flight was shorter than a Boeing 747 wingspan",
        "Many experts said powered flight was impossible",
        "Within 66 years, humans walked on the moon"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-top-005",
    title: "Moon Landing",
    description: "Humanity's first steps on another celestial body.",
    year: 1969,
    era: "modern",
    tags: ["science", "exploration"],
    difficulty: 3,
    state: "safe",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 0.4, // Space age gets compressed
    content: {
      story: "Neil Armstrong and Buzz Aldrin walked on the moon while Michael Collins orbited above.",
      funFacts: [
        "Over 600 million people watched on TV",
        "The computer that got them there had less power than a modern calculator",
        "Footprints on the moon will last millions of years (no wind to erase them)"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-top-006",
    title: "World Wide Web",
    description: "Tim Berners-Lee created the system that connected the world.",
    year: 1991,
    era: "digital",
    tags: ["innovation", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 0,
    parentEventId: null,
    isKeyEvent: true,
    weight: 0.3, // Digital age gets most compressed
    content: {
      story: "The Web made the internet accessible to everyone, transforming communication, commerce, and culture.",
      funFacts: [
        "Tim Berners-Lee gave it away for free instead of patenting it",
        "The first website explained what the World Wide Web was",
        "By 2000, there were 17 million websites; now there are over 1 billion"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Ancient Era drill-down (3500 BCE - 500 CE)
 * Events revealed when drilling into "The Wheel"
 */
export const ancientEraEvents: HierarchicalEvent[] = [
  {
    id: "evt-l1-001",
    title: "Writing Systems",
    description: "Cuneiform in Mesopotamia allowed humans to record history.",
    year: -3200,
    era: "ancient",
    tags: ["culture", "innovation"],
    difficulty: 1,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-001",
    isKeyEvent: true,
    content: {
      story: "Writing let people keep records, tell stories, and preserve knowledge across generations.",
      funFacts: [
        "Earliest writing was used for accounting - counting sheep and grain",
        "Cuneiform used a reed stylus pressed into wet clay",
        "Egyptian hieroglyphics developed independently around the same time"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-002",
    title: "The Great Pyramids",
    description: "Monumental tombs that showcased ancient engineering brilliance.",
    year: -2560,
    era: "ancient",
    tags: ["culture", "innovation"],
    difficulty: 2,
    state: "threatened",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-001",
    isKeyEvent: true,
    content: {
      story: "The Great Pyramid of Giza was the world's tallest building for 3,800 years.",
      funFacts: [
        "Made of over 2 million stone blocks",
        "Aligned precisely with cardinal directions",
        "Built by paid workers, not slaves"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-003",
    title: "Code of Hammurabi",
    description: "One of the first written law codes, establishing justice principles.",
    year: -1754,
    era: "ancient",
    tags: ["culture", "politics"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-001",
    isKeyEvent: true,
    content: {
      story: "282 laws carved in stone, covering everything from trade to family disputes.",
      funFacts: [
        "Famous for 'eye for an eye' principle",
        "Different punishments for different social classes",
        "Carved on an 8-foot tall stone pillar"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-004",
    title: "Birth of Democracy",
    description: "Athens introduced citizen voting and direct democracy.",
    year: -508,
    era: "ancient",
    tags: ["politics", "culture"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-001",
    isKeyEvent: true,
    content: {
      story: "Citizens could vote directly on laws and policies - a revolutionary idea.",
      funFacts: [
        "Only free male citizens could vote (about 10-20% of population)",
        "Used colored stones to cast votes",
        "Inspired modern democratic governments"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-005",
    title: "Roman Empire Peak",
    description: "Rome controlled the Mediterranean and brought unprecedented unity.",
    year: 117,
    era: "ancient",
    tags: ["politics", "culture"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-001",
    isKeyEvent: true,
    content: {
      story: "At its height under Emperor Trajan, Rome ruled 5 million square kilometers.",
      funFacts: [
        "Built 250,000 miles of roads",
        "Introduced aqueducts, concrete, and arches",
        "Latin became the basis for Romance languages"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Medieval/Renaissance drill-down (500 - 1700)
 * Events revealed when drilling into "The Printing Press"
 */
export const medievalRenaissanceEvents: HierarchicalEvent[] = [
  {
    id: "evt-l1-101",
    title: "Gunpowder",
    description: "Chinese invention that changed warfare forever.",
    year: 1000,
    era: "medieval",
    tags: ["innovation", "war"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-002",
    isKeyEvent: true,
    content: {
      story: "Originally used for fireworks, gunpowder revolutionized military tactics.",
      funFacts: [
        "Chinese alchemists discovered it while seeking immortality elixir",
        "First guns appeared in China around 1200",
        "Ended the age of castles and knights in armor"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-102",
    title: "Magna Carta",
    description: "Limited royal power and established rule of law.",
    year: 1215,
    era: "medieval",
    tags: ["politics", "culture"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-002",
    isKeyEvent: true,
    content: {
      story: "English nobles forced King John to sign, limiting his power and protecting their rights.",
      funFacts: [
        "Inspired the US Constitution centuries later",
        "Most clauses were quickly repealed",
        "Established the principle: even kings must follow the law"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-103",
    title: "Black Death",
    description: "Pandemic that killed 1/3 of Europe's population.",
    year: 1347,
    era: "medieval",
    tags: ["health", "crisis"],
    difficulty: 3,
    state: "attacked",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-002",
    isKeyEvent: true,
    content: {
      story: "Bubonic plague spread via trade routes, devastating cities and reshaping society.",
      funFacts: [
        "Killed an estimated 75-200 million people",
        "Led to labor shortages that improved conditions for peasants",
        "Took 200 years for Europe's population to recover"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-104",
    title: "Columbus Reaches Americas",
    description: "European contact with the Americas began.",
    year: 1492,
    era: "renaissance",
    tags: ["exploration"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-002",
    isKeyEvent: true,
    content: {
      story: "Columbus's voyage connected two worlds, with profound consequences for both.",
      funFacts: [
        "Columbus thought he'd reached Asia",
        "Indigenous peoples had lived in the Americas for 15,000+ years",
        "Columbian Exchange transformed cuisines worldwide"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-105",
    title: "The Telescope",
    description: "Galileo's observations challenged Earth-centered cosmology.",
    year: 1609,
    era: "renaissance",
    tags: ["science", "innovation"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-002",
    isKeyEvent: true,
    content: {
      story: "Galileo saw Jupiter's moons, proving not everything orbits Earth.",
      funFacts: [
        "His first telescope magnified 3x; he improved it to 30x",
        "Church put him under house arrest for his discoveries",
        "Opened the door to modern astronomy"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Industrial Era drill-down (1700 - 1900)
 * Events revealed when drilling into "The Steam Engine"
 */
export const industrialEraEvents: HierarchicalEvent[] = [
  {
    id: "evt-l1-201",
    title: "American Revolution",
    description: "Colonies declared independence, inspiring democratic movements worldwide.",
    year: 1776,
    era: "industrial",
    tags: ["politics", "war"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-003",
    isKeyEvent: true,
    content: {
      story: "Declaration of Independence proclaimed that 'all men are created equal.'",
      funFacts: [
        "Started with protests over tea taxes",
        "France helped the colonies win",
        "Created the first modern constitutional democracy"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-202",
    title: "Photography Invented",
    description: "First permanent photograph captured by Joseph Niépce.",
    year: 1826,
    era: "industrial",
    tags: ["innovation", "culture"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-003",
    isKeyEvent: true,
    content: {
      story: "The first photo required 8 hours of exposure time to capture an image.",
      funFacts: [
        "The earliest surviving photo shows rooftops from a window",
        "Revolutionized how we remember history",
        "Led to movies, television, and digital cameras"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-203",
    title: "Telegraph",
    description: "Samuel Morse's invention enabled instant long-distance communication.",
    year: 1844,
    era: "industrial",
    tags: ["innovation", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-003",
    isKeyEvent: true,
    content: {
      story: "Messages that once took weeks by horse could now arrive in minutes.",
      funFacts: [
        "First message: 'What hath God wrought'",
        "Used Morse code: dots and dashes",
        "Connected continents via undersea cables"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-204",
    title: "Telephone",
    description: "Alexander Graham Bell's device let people talk across distances.",
    year: 1876,
    era: "industrial",
    tags: ["innovation", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-003",
    isKeyEvent: true,
    content: {
      story: "First words spoken: 'Mr. Watson, come here, I want to see you.'",
      funFacts: [
        "Bell was actually trying to improve the telegraph",
        "By 1900, there were 600,000 phones in the US",
        "Led to smartphones 130 years later"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-205",
    title: "Light Bulb",
    description: "Edison's practical incandescent bulb illuminated the world.",
    year: 1879,
    era: "industrial",
    tags: ["innovation", "science"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-003",
    isKeyEvent: true,
    content: {
      story: "Edison didn't invent the light bulb, but he made it practical and affordable.",
      funFacts: [
        "Tested over 3,000 materials for the filament",
        "First bulbs lasted only 13.5 hours",
        "Transformed cities - no more gaslights or candles"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Early Modern drill-down (1900 - 1950)
 * Events revealed when drilling into "The Airplane"
 */
export const earlyModernEvents: HierarchicalEvent[] = [
  {
    id: "evt-l1-301",
    title: "Radio Broadcasting",
    description: "Wireless communication brought news and entertainment to millions.",
    year: 1920,
    era: "modern",
    tags: ["innovation", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-004",
    isKeyEvent: true,
    content: {
      story: "For the first time, people could hear voices from around the world in their homes.",
      funFacts: [
        "First commercial radio station: KDKA in Pittsburgh",
        "By 1930, 40% of US homes had radios",
        "United nations during World War II through broadcasts"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-302",
    title: "Penicillin Discovery",
    description: "Alexander Fleming's accidental discovery saved millions of lives.",
    year: 1928,
    era: "modern",
    tags: ["science", "health"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-004",
    isKeyEvent: true,
    content: {
      story: "A moldy petri dish led to the first antibiotic, revolutionizing medicine.",
      funFacts: [
        "Fleming noticed mold killed bacteria in a forgotten dish",
        "Mass production started during WWII",
        "Reduced death from infections by over 90%"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-303",
    title: "Television",
    description: "Moving pictures broadcast into homes transformed entertainment.",
    year: 1927,
    era: "modern",
    tags: ["innovation", "culture"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-004",
    isKeyEvent: true,
    content: {
      story: "Philo Farnsworth demonstrated electronic television at age 21.",
      funFacts: [
        "First image transmitted: a dollar sign",
        "By 1960, 90% of US homes had TVs",
        "Changed politics, advertising, and culture"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-304",
    title: "World War II Ends",
    description: "The deadliest conflict in human history concluded.",
    year: 1945,
    era: "modern",
    tags: ["war", "politics"],
    difficulty: 3,
    state: "attacked",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-004",
    isKeyEvent: true,
    content: {
      story: "The war killed 70-85 million people and reshaped the global order.",
      funFacts: [
        "First and only use of nuclear weapons in war",
        "Led to creation of United Nations",
        "Sparked the Cold War between US and USSR"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-305",
    title: "DNA Structure Discovered",
    description: "Watson and Crick revealed the double helix, unlocking genetics.",
    year: 1953,
    era: "modern",
    tags: ["science"],
    difficulty: 3,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-004",
    isKeyEvent: false, // This bridges to next period
    content: {
      story: "Understanding DNA's structure enabled genetic medicine and biotechnology.",
      funFacts: [
        "Rosalind Franklin's X-ray images were crucial",
        "Led to genome sequencing and genetic engineering",
        "Explained how life passes traits to offspring"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Space Age drill-down (1950 - 1990)
 * Events revealed when drilling into "Moon Landing"
 */
export const spaceAgeEvents: HierarchicalEvent[] = [
  {
    id: "evt-l1-401",
    title: "Sputnik Launch",
    description: "USSR's satellite started the Space Race.",
    year: 1957,
    era: "modern",
    tags: ["science", "exploration"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-005",
    isKeyEvent: true,
    content: {
      story: "The world's first artificial satellite shocked Americans and accelerated space exploration.",
      funFacts: [
        "Size of a beach ball, weighed 184 pounds",
        "Orbited Earth every 96 minutes",
        "Led to NASA's creation in 1958"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-402",
    title: "Microprocessor Invented",
    description: "Intel's 4004 chip put a computer on a single piece of silicon.",
    year: 1971,
    era: "modern",
    tags: ["innovation", "science"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-005",
    isKeyEvent: true,
    content: {
      story: "The computer CPU shrank from room-sized to fingernail-sized.",
      funFacts: [
        "Originally designed for a calculator",
        "Had 2,300 transistors (modern chips have billions)",
        "Made personal computers possible"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-403",
    title: "Personal Computer",
    description: "Apple II and IBM PC brought computers to homes and offices.",
    year: 1977,
    era: "modern",
    tags: ["innovation"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-005",
    isKeyEvent: true,
    content: {
      story: "Computers were no longer just for big companies and universities.",
      funFacts: [
        "Apple II cost $1,298 (about $6,000 today)",
        "Had 4KB of RAM (modern phones have millions of times more)",
        "Introduced color graphics and sound"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-404",
    title: "IBM PC Released",
    description: "Standardized personal computing and launched the PC era.",
    year: 1981,
    era: "modern",
    tags: ["innovation"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-005",
    isKeyEvent: true,
    content: {
      story: "IBM's open architecture let anyone build compatible computers.",
      funFacts: [
        "Cost $1,565 (about $5,000 today)",
        "Ran MS-DOS (Microsoft's first big success)",
        "Sparked the 'PC clone' industry"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-405",
    title: "Berlin Wall Falls",
    description: "Cold War symbol crumbled, reuniting Germany.",
    year: 1989,
    era: "modern",
    tags: ["politics"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-005",
    isKeyEvent: true,
    content: {
      story: "Germans celebrated as the wall that divided them for 28 years came down.",
      funFacts: [
        "Built in 1961 to stop East Germans from fleeing",
        "Separated families for nearly 3 decades",
        "Symbolized the end of Soviet domination in Eastern Europe"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * LEVEL 1: Digital Age drill-down (1990 - 2025)
 * Events revealed when drilling into "World Wide Web"
 * NOTE: This era needs LEVEL 2 drill-downs due to high density
 */
export const digitalAgeLevel1Events: HierarchicalEvent[] = [
  {
    id: "evt-l1-501",
    title: "Linux Released",
    description: "Open-source operating system democratized software development.",
    year: 1991,
    era: "digital",
    tags: ["innovation"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "Linus Torvalds shared his OS code freely, spawning a global collaboration movement.",
      funFacts: [
        "Started as a hobby project by a 21-year-old student",
        "Now powers most web servers and Android phones",
        "Thousands of developers contribute for free"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-502",
    title: "Google Founded",
    description: "Search engine organized the world's information.",
    year: 1998,
    era: "digital",
    tags: ["innovation", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "Larry Page and Sergey Brin created a better way to find information online.",
      funFacts: [
        "Name comes from 'googol' (10^100)",
        "Started in a garage",
        "Processes 8.5 billion searches per day"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-503",
    title: "Wikipedia Launched",
    description: "Free encyclopedia anyone can edit.",
    year: 2001,
    era: "digital",
    tags: ["culture", "communication"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "Collaborative knowledge base with 60+ million articles in 300+ languages.",
      funFacts: [
        "5th most-visited website globally",
        "Written by volunteers, no ads",
        "Has articles on topics no traditional encyclopedia would cover"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-504",
    title: "Social Media Era Begins",
    description: "Facebook launched, transforming how people connect.",
    year: 2004,
    era: "digital",
    tags: ["culture", "communication"],
    difficulty: 2,
    state: "threatened",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "Started in a Harvard dorm room, now connects 3 billion people.",
      funFacts: [
        "Originally only for college students",
        "Sparked the social media revolution",
        "Changed politics, journalism, and relationships"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-505",
    title: "iPhone Released",
    description: "Smartphone revolutionized mobile computing.",
    year: 2007,
    era: "digital",
    tags: ["innovation"],
    difficulty: 2,
    state: "safe",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "Apple combined phone, internet, and iPod into one device with a touchscreen.",
      funFacts: [
        "Cost $499-$599 at launch",
        "First iPhone had no App Store",
        "Sparked the smartphone revolution (billions now own one)"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
  {
    id: "evt-l1-506",
    title: "AI Revolution",
    description: "ChatGPT democratized artificial intelligence.",
    year: 2022,
    era: "digital",
    tags: ["innovation", "science"],
    difficulty: 3,
    state: "threatened",
    hierarchyLevel: 1,
    weight: 1,
    parentEventId: "evt-top-006",
    isKeyEvent: true,
    content: {
      story: "AI that can write, code, and reason reached mainstream users.",
      funFacts: [
        "Reached 100 million users in 2 months (fastest ever)",
        "Built on decades of AI research",
        "Raising questions about jobs, creativity, and society"
      ],
      triggers: {
        game: {
          placeholder: "Defend this event!",
          previewDescription: "Answer questions correctly to defend this historical event from corruption."
        }
      }
    }
  },
];

/**
 * Export all events as flat array for database
 */
export const allHierarchicalEvents: HierarchicalEvent[] = [
  ...topLevelEvents,
  ...ancientEraEvents,
  ...medievalRenaissanceEvents,
  ...industrialEraEvents,
  ...earlyModernEvents,
  ...spaceAgeEvents,
  ...digitalAgeLevel1Events,
];
