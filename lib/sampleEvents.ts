/**
 * Sample Events for MVP
 * Provides 8-10 historical events for Epic 2: Timeline Arc Navigation
 * Epic 5: Extended with hierarchical segments and event states
 * These are hardcoded events to avoid database dependency during initial development
 */

import type { Event, TimelineSegment, TimelineEventState } from "@/types";

/**
 * Sample events spanning from ancient history to modern times
 * Each event includes an arcPosition (0-100) representing its position along the timeline arc
 * Epic 5: Added state and segmentId for timeline improvements
 */
export interface TimelineEvent extends Event {
  arcPosition: number; // 0-100, position along the arc curve
  state: TimelineEventState; // Epic 5: safe, threatened, or attacked
  segmentId: string; // Epic 5: which segment this event belongs to
  isKeyEvent: boolean; // Epic 5: shown at parent level
}

export const sampleEvents: TimelineEvent[] = [
  {
    id: "evt-001",
    title: "The Wheel",
    description: "One of humanity's greatest inventions, revolutionizing transportation and mechanics.",
    year: -3500,
    era: "ancient",
    tags: ["invention", "innovation"],
    difficulty: 1,
    arcPosition: 5,
    state: "safe",
    segmentId: "seg-early-ancient",
    isKeyEvent: true,
    content: {
      story: "Around 3500 BCE, someone had a brilliant idea: why not make moving heavy things easier? The wheel changed everything, from carts to pottery wheels to water mills.",
      funFacts: [
        "The oldest wheel was found in Mesopotamia (modern-day Iraq)",
        "Early wheels were made from solid wood",
        "It took 300 years before someone thought to put wheels on chariots!"
      ],
      triggers: {
        story: {
          content: "Imagine living in a world without wheels. Every heavy object had to be dragged, pushed, or carried. Moving stones to build a temple? Exhausting! Transporting grain from the farm to the city? A huge challenge!\n\nAround 3500 BCE, in ancient Mesopotamia (the land between the Tigris and Euphrates rivers, now Iraq), someone made a breakthrough. They took a thick slice of a tree trunk and realized it could roll. At first, these wheels were solid and heavy, but they worked!\n\nThe wheel didn't just help with transportation. Ancient potters used wheels to spin clay and create perfectly round pots. Farmers used water wheels to irrigate their crops. The wheel was everywhere, making life easier in so many ways.\n\nInterestingly, some ancient civilizations never invented the wheel. The Incas in South America built amazing roads and cities without it, using llamas and human power instead. This shows that different societies can solve problems in different ways!",
          images: ["/images/ancient-wheel.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "You'll design your own simple machine using wheels, axles, and ramps to move a heavy stone block."
        },
        related: {
          items: [
            {
              id: "evt-002",
              name: "The Great Pyramid",
              description: "Built before the wheel was widely used in Egypt - workers moved massive stones using logs and ramps!",
              year: -2560
            },
            {
              id: "evt-006",
              name: "The Steam Engine",
              description: "Wheels powered by steam revolutionized transportation thousands of years later.",
              year: 1776
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-002",
    title: "The Great Pyramid",
    description: "The last remaining wonder of the ancient world, built as a tomb for Pharaoh Khufu.",
    year: -2560,
    era: "ancient",
    tags: ["innovation", "culture"],
    difficulty: 2,
    arcPosition: 12,
    state: "threatened",
    segmentId: "seg-early-ancient",
    isKeyEvent: true,
    content: {
      story: "The Great Pyramid of Giza is a marvel of ancient engineering. It took about 20 years to build and was the tallest human-made structure for over 3,800 years!",
      funFacts: [
        "It's made of over 2 million stone blocks",
        "Each block weighs about 2.5 tons on average",
        "It was originally covered in smooth white limestone that sparkled in the sun"
      ],
      triggers: {
        story: {
          content: "Picture this: you're a worker in ancient Egypt, around 2560 BCE. Pharaoh Khufu wants the biggest, most impressive tomb ever built. Your job? Help build a pyramid so tall that it will remain the world's tallest building for the next 3,800 years!\n\nThe Great Pyramid wasn't built by slaves, as many people think. Recent evidence shows it was built by skilled workers who were paid for their labor. Tens of thousands of workers hauled massive limestone blocks from nearby quarries. Without wheels (they weren't common in Egypt yet), they used wooden sledges, ropes, and probably water to reduce friction.\n\nThe pyramid originally stood 481 feet tall and was covered in polished white limestone that reflected the sun's light. Ancient visitors said it was blindingly bright! Inside, narrow passages lead to chambers where the pharaoh was buried with treasures for the afterlife.\n\nWhat's most amazing is how precise it is. The base is almost perfectly level, and the sides align with the cardinal directions (north, south, east, west) with incredible accuracy. Even with modern technology, matching this precision would be challenging!",
          images: ["/images/great-pyramid.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "You'll engineer a system to move heavy pyramid blocks using ramps, levers, and teamwork."
        },
        related: {
          items: [
            {
              id: "evt-001",
              name: "The Wheel",
              description: "Invented around the same time, but not used in pyramid construction!",
              year: -3500
            },
            {
              id: "evt-004",
              name: "The Printing Press",
              description: "Another invention that required precise engineering and changed the world.",
              year: 1440
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-003",
    title: "Gunpowder",
    description: "A Chinese invention that changed warfare and led to fireworks celebrations.",
    year: 850,
    era: "medieval",
    tags: ["invention", "discovery", "innovation"],
    difficulty: 2,
    arcPosition: 28,
    state: "safe",
    segmentId: "seg-medieval",
    isKeyEvent: true,
    content: {
      story: "Chinese alchemists were trying to create a potion for immortality when they accidentally discovered gunpowder. Instead of living forever, they created something that changed war and gave us fireworks!",
      funFacts: [
        "The recipe was kept secret for centuries",
        "It was used for fireworks before weapons",
        "Gunpowder is made from saltpeter, charcoal, and sulfur"
      ],
      triggers: {
        story: {
          content: "In ancient China, around 850 CE, alchemists were mixing different substances, trying to find the secret to eternal life. They mixed saltpeter (potassium nitrate), charcoal, and sulfur together. When they heated this mixture, BOOM! They definitely didn't find immortality, but they found something that would change the world.\n\nAt first, the Chinese used gunpowder for fun - creating beautiful fireworks for festivals and celebrations. Imagine the first time someone saw an explosion of colored sparks light up the night sky! It must have seemed like magic.\n\nBut soon, people realized gunpowder could be used in warfare. The Chinese invented fire arrows, early grenades, and even primitive guns. When the Mongols learned about gunpowder, they spread the knowledge across Asia and into Europe.\n\nBy the 1300s, European armies were using cannons and guns. Castles that had stood for centuries could now be broken down by cannonballs. The age of knights in armor was ending, and gunpowder was changing how wars were fought. One accidental discovery by alchemists seeking immortality ended up changing human history forever!",
          images: ["/images/gunpowder-fireworks.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Mix the correct proportions of ingredients to create a safe firework display."
        },
        related: {
          items: [
            {
              id: "evt-004",
              name: "The Printing Press",
              description: "Another invention that spread knowledge and changed warfare through better communication.",
              year: 1440
            },
            {
              id: "evt-006",
              name: "The Steam Engine",
              description: "Like gunpowder, steam power revolutionized both industry and warfare.",
              year: 1776
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-004",
    title: "The Printing Press",
    description: "Johannes Gutenberg's invention made books affordable and spread knowledge rapidly.",
    year: 1440,
    era: "renaissance",
    tags: ["invention", "innovation", "culture"],
    difficulty: 2,
    arcPosition: 42,
    state: "attacked",
    segmentId: "seg-medieval",
    isKeyEvent: true,
    content: {
      story: "Before the printing press, books had to be copied by hand. Johannes Gutenberg invented a way to print many copies quickly, making knowledge available to everyone, not just the wealthy.",
      funFacts: [
        "The first printed book was the Gutenberg Bible",
        "It could print about 3,600 pages per day",
        "Before this, a single book could take months to copy by hand"
      ],
      triggers: {
        story: {
          content: "Imagine wanting to read a book in the 1400s. You'd have to go to a monastery where monks spent their entire lives copying books by hand, one letter at a time. A single book could cost as much as a farm! Only the very rich could afford personal libraries.\n\nJohannes Gutenberg, a German goldsmith, changed everything. He created movable metal type - individual letters that could be arranged, inked, and pressed onto paper. After printing one page, you could rearrange the letters to print another. His first major project was printing 180 copies of the Bible.\n\nThe impact was incredible. Suddenly, books became affordable. Ideas spread faster than ever before. Scientists could share discoveries with other scientists across Europe. Martin Luther used printing to spread his religious ideas, starting the Protestant Reformation. Universities grew because students could own textbooks.\n\nWithin 50 years of Gutenberg's invention, there were printing presses in over 200 European cities, producing millions of books. This was the beginning of the Information Age - not the digital one we live in now, but the original explosion of shared knowledge that helped create the modern world!",
          images: ["/images/printing-press.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Arrange movable type to print a page, racing against the clock!"
        },
        related: {
          items: [
            {
              id: "evt-003",
              name: "Gunpowder",
              description: "Both inventions spread from Asia to Europe and changed society dramatically.",
              year: 850
            },
            {
              id: "evt-009",
              name: "The Internet",
              description: "The printing press was the first information revolution; the internet was the second.",
              year: 1969
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-005",
    title: "The Telescope",
    description: "Galileo's improved telescope revealed moons, planets, and changed our view of the universe.",
    year: 1609,
    era: "renaissance",
    tags: ["invention", "discovery", "science"],
    difficulty: 2,
    arcPosition: 52,
    state: "safe",
    segmentId: "seg-medieval",
    isKeyEvent: false,
    content: {
      story: "Galileo didn't invent the telescope, but he made it much better. When he pointed it at the sky, he discovered Jupiter's moons and saw that Earth wasn't the center of the universe!",
      funFacts: [
        "Galileo's telescope could magnify objects 20 times",
        "He discovered four of Jupiter's moons",
        "The Catholic Church didn't like his findings and put him under house arrest"
      ],
      triggers: {
        story: {
          content: "In 1609, Galileo Galilei heard about a Dutch invention - a tube with lenses that made distant objects look closer. As a scientist and inventor, he was fascinated. Within months, he had built his own telescope that was much more powerful.\n\nWhen Galileo pointed his telescope at the night sky, he made discoveries that shocked the world. He saw mountains on the Moon - people thought it was a perfect, smooth sphere! He discovered four moons orbiting Jupiter, proving that not everything orbited Earth. He saw that Venus had phases like our Moon, which supported the idea that planets orbit the Sun.\n\nThese discoveries challenged the beliefs of his time. The Catholic Church taught that Earth was the center of the universe, with everything revolving around it. Galileo's observations supported Copernicus's idea that Earth and other planets orbit the Sun. For teaching this, Galileo was put on trial and spent the rest of his life under house arrest.\n\nBut Galileo was right, and his telescope opened a new window to understanding our place in the universe. Today, powerful telescopes like Hubble continue his work, revealing distant galaxies and expanding our knowledge of the cosmos.",
          images: ["/images/galileo-telescope.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Use a telescope to discover Jupiter's moons and track their movement over several nights."
        },
        related: {
          items: [
            {
              id: "evt-004",
              name: "The Printing Press",
              description: "Helped spread Galileo's ideas despite attempts to suppress them.",
              year: 1440
            },
            {
              id: "evt-009",
              name: "The Internet",
              description: "Like the telescope, it expanded our ability to see and understand the world.",
              year: 1969
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-006",
    title: "The Steam Engine",
    description: "James Watt's improvements powered the Industrial Revolution.",
    year: 1776,
    era: "industrial",
    tags: ["invention", "innovation", "technology"],
    difficulty: 3,
    arcPosition: 63,
    state: "threatened",
    segmentId: "seg-industrial",
    isKeyEvent: true,
    content: {
      story: "James Watt didn't invent the steam engine, but he made it so much better that it could power factories, trains, and ships. This kicked off the Industrial Revolution!",
      funFacts: [
        "Steam engines convert heat energy into mechanical work",
        "Watt's name lives on in the 'watt' unit of power",
        "Steam trains could travel up to 30 mph - incredibly fast for the time!"
      ],
      triggers: {
        story: {
          content: "Before steam engines, people relied on muscle power (human and animal), water wheels, and windmills. These power sources had limits - horses got tired, rivers sometimes dried up, and the wind didn't always blow.\n\nJames Watt, a Scottish inventor, dramatically improved the steam engine in 1776. His engine was much more efficient than earlier versions, wasting less fuel. This made it practical to use steam power in factories, mines, and eventually for transportation.\n\nThe impact was revolutionary. Factories could be built anywhere, not just near rivers for water power. Trains powered by steam could carry goods and people across countries at speeds never imagined. Ships no longer depended on wind and could cross oceans on schedules. Cities grew as people moved from farms to work in factories.\n\nThe Industrial Revolution changed where people lived, how they worked, and what they could make. It also had downsides - pollution, difficult working conditions, and child labor. But it marked the beginning of the modern industrial world we live in today.",
          images: ["/images/steam-engine.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Manage steam pressure and fuel to power a factory or locomotive efficiently."
        },
        related: {
          items: [
            {
              id: "evt-001",
              name: "The Wheel",
              description: "Steam engines made wheels move faster than ever before with trains and steamships.",
              year: -3500
            },
            {
              id: "evt-007",
              name: "The Light Bulb",
              description: "Electricity would eventually replace steam as the primary power source.",
              year: 1879
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-007",
    title: "The Light Bulb",
    description: "Thomas Edison's practical electric light bulb illuminated the world.",
    year: 1879,
    era: "industrial",
    tags: ["invention", "innovation", "technology"],
    difficulty: 2,
    arcPosition: 73,
    state: "safe",
    segmentId: "seg-industrial",
    isKeyEvent: true,
    content: {
      story: "Many inventors worked on electric lights, but Thomas Edison created one that was practical and long-lasting. No more candles and gas lamps - cities could now light up at night!",
      funFacts: [
        "Edison tested over 3,000 designs before finding the right one",
        "The first successful bulb lasted 13.5 hours",
        "Edison's team also invented the power grid to distribute electricity"
      ],
      triggers: {
        story: {
          content: "For thousands of years, people lived by the rhythm of the sun. When it got dark, you lit a candle, an oil lamp, or a gas light. These were dim, smoky, and sometimes dangerous. Imagine trying to read or do homework by candlelight!\n\nThomas Edison wasn't the first person to create an electric light, but he was the first to make one that was practical and affordable. He tested thousands of materials for the filament (the part that glows), finally finding that carbonized bamboo worked best. His bulb could last for hundreds of hours.\n\nBut Edison didn't stop there. He realized that just inventing a light bulb wasn't enough - people needed electricity in their homes! So his team invented the entire electrical power system: generators, wires, switches, and meters. In 1882, he opened the first power plant in New York City, bringing electricity to 85 buildings.\n\nElectric lights transformed society. Factories could operate at night. People could read and study after dark. Cities became safer and more active after sunset. Today we take electric lights for granted, flipping a switch without thinking about how revolutionary this simple act once was!",
          images: ["/images/edison-lightbulb.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Experiment with different filament materials to create a long-lasting light bulb."
        },
        related: {
          items: [
            {
              id: "evt-006",
              name: "The Steam Engine",
              description: "Early power plants used steam engines to generate electricity for light bulbs.",
              year: 1776
            },
            {
              id: "evt-010",
              name: "The Smartphone",
              description: "Modern devices like smartphones rely on electrical innovation that started with the light bulb.",
              year: 2007
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-008",
    title: "The Airplane",
    description: "The Wright Brothers achieved the first powered flight at Kitty Hawk.",
    year: 1903,
    era: "modern",
    tags: ["invention", "innovation", "technology"],
    difficulty: 3,
    arcPosition: 82,
    state: "safe",
    segmentId: "seg-early-modern",
    isKeyEvent: true,
    content: {
      story: "Orville and Wilbur Wright were bicycle mechanics who dreamed of flying. On December 17, 1903, they flew for just 12 seconds - but it was the first controlled, powered flight in history!",
      funFacts: [
        "Their first flight covered only 120 feet - less than a modern plane's wingspan",
        "They made four flights that day, the longest lasting 59 seconds",
        "They had to invent their own lightweight engine"
      ],
      triggers: {
        story: {
          content: "For centuries, humans dreamed of flying like birds. Many tried and failed, some dying in the attempt. What made Orville and Wilbur Wright different? They were patient, systematic, and scientific in their approach.\n\nThe Wright brothers owned a bicycle shop in Dayton, Ohio. They studied birds, built gliders, and tested wing designs in a wind tunnel they built themselves. They realized that controlling an aircraft was just as important as getting it off the ground. They invented a system to twist the wings slightly, allowing the pilot to steer.\n\nOn December 17, 1903, at Kitty Hawk, North Carolina, they were ready. Orville piloted the first flight, which lasted just 12 seconds and covered 120 feet. That's shorter than a jumbo jet! But it was controlled, powered flight - something never achieved before. They made three more flights that day, with Wilbur flying 852 feet in 59 seconds.\n\nJust 66 years later, humans landed on the Moon. The airplane revolutionized travel, warfare, and commerce. Today, millions of people fly every day, crossing continents in hours instead of weeks. All because two bicycle mechanics refused to believe that flight was impossible!",
          images: ["/images/wright-brothers.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Design and test different wing shapes to achieve stable, controlled flight."
        },
        related: {
          items: [
            {
              id: "evt-006",
              name: "The Steam Engine",
              description: "Transportation revolution part one; airplanes completed the revolution.",
              year: 1776
            },
            {
              id: "evt-009",
              name: "The Internet",
              description: "Computers guided by the internet now help fly modern aircraft.",
              year: 1969
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-009",
    title: "The Internet",
    description: "ARPANET connected computers, evolving into today's global network.",
    year: 1969,
    era: "digital",
    tags: ["invention", "innovation", "technology"],
    difficulty: 3,
    arcPosition: 90,
    state: "threatened",
    segmentId: "seg-contemporary",
    isKeyEvent: true,
    content: {
      story: "The first message sent over the internet was supposed to be 'LOGIN' but the system crashed after 'LO'! From this humble start, the internet grew to connect billions of people worldwide.",
      funFacts: [
        "The first internet message was sent on October 29, 1969",
        "Only four computers were connected in the first network",
        "Today, there are over 5 billion internet users worldwide"
      ],
      triggers: {
        story: {
          content: "In the 1960s, computers were huge machines that filled entire rooms. Each computer worked alone, unable to talk to other computers. Scientists wondered: what if we could connect computers so they could share information?\n\nThe U.S. Department of Defense funded a project called ARPANET to link research computers across the country. On October 29, 1969, a student tried to send the word 'LOGIN' from UCLA to Stanford. The system crashed after 'LO' - but those two letters were the first message ever sent over the internet!\n\nAt first, only universities and research centers used the internet. In 1989, Tim Berners-Lee invented the World Wide Web, making it easy for anyone to create and view web pages. In the 1990s, companies like America Online and Netscape brought the internet to homes.\n\nToday, the internet has transformed how we learn, communicate, shop, work, and play. You can video chat with someone on the other side of the world, access information on any topic instantly, and share ideas with millions of people. The internet connects over 5 billion people and is still growing, changing our world in ways the inventors never imagined!",
          images: ["/images/early-internet.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Route data packets through a network, learning how information travels across the internet."
        },
        related: {
          items: [
            {
              id: "evt-004",
              name: "The Printing Press",
              description: "The first information revolution; the internet is the second.",
              year: 1440
            },
            {
              id: "evt-010",
              name: "The Smartphone",
              description: "Put the power of the internet in everyone's pocket.",
              year: 2007
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
  {
    id: "evt-010",
    title: "The Smartphone",
    description: "Combining phone, computer, and camera into one pocket-sized device.",
    year: 2007,
    era: "digital",
    tags: ["invention", "innovation", "technology"],
    difficulty: 2,
    arcPosition: 96,
    state: "attacked",
    segmentId: "seg-contemporary",
    isKeyEvent: true,
    content: {
      story: "When Apple launched the iPhone in 2007, it changed how we communicate, learn, and play. Now we carry powerful computers in our pockets everywhere we go!",
      funFacts: [
        "The first iPhone had only 4GB or 8GB of storage",
        "It couldn't even record video at first",
        "Today's smartphones are more powerful than the computers used in the moon landing"
      ],
      triggers: {
        story: {
          content: "Before 2007, phones were mainly for calling and texting. Sure, some phones could browse simple websites or take blurry photos, but they were clunky to use. Then Steve Jobs stood on stage and introduced the iPhone - and everything changed.\n\nThe iPhone combined a phone, an iPod music player, and an internet communicator into one sleek device with a touchscreen. No more tiny keyboards or styluses - you could control everything with your finger! Apps from the App Store let you do almost anything: play games, check the weather, navigate with maps, edit photos, and thousands of other tasks.\n\nOther companies soon created their own smartphones using Google's Android system. Competition made smartphones better and more affordable. Today, there are more smartphones on Earth than people! Billions of individuals in developing countries skipped desktop computers entirely and went straight to smartphones for their internet access.\n\nSmartphones have changed society in profound ways. We navigate with GPS, learn from educational apps, stay connected with friends worldwide, and document our lives with photos and videos. Your smartphone has more computing power than the computers NASA used to land astronauts on the Moon. You're carrying a revolution in your pocket!",
          images: ["/images/smartphone-evolution.jpg"]
        },
        game: {
          placeholder: "Mini-game coming soon!",
          previewDescription: "Design your own app interface and see how many users you can reach!"
        },
        related: {
          items: [
            {
              id: "evt-009",
              name: "The Internet",
              description: "Smartphones brought the internet to billions of people's pockets.",
              year: 1969
            },
            {
              id: "evt-007",
              name: "The Light Bulb",
              description: "Like Edison's power system, smartphones created an entire ecosystem of apps and services.",
              year: 1879
            }
          ]
        }
      }
    },
    createdAt: new Date(),
  },
];

/**
 * Get a sample event by ID
 */
export function getSampleEventById(id: string): TimelineEvent | undefined {
  return sampleEvents.find((event) => event.id === id);
}

/**
 * Get sample events sorted by year
 */
export function getSampleEventsByYear(): TimelineEvent[] {
  return [...sampleEvents].sort((a, b) => a.year - b.year);
}

/**
 * Get sample events sorted by arc position
 */
export function getSampleEventsByArcPosition(): TimelineEvent[] {
  return [...sampleEvents].sort((a, b) => a.arcPosition - b.arcPosition);
}

/**
 * Epic 5: Hierarchical timeline segments
 * Three-level hierarchy: Top Level > Mid Level > Leaf Level
 */
export const timelineSegments: TimelineSegment[] = [
  // Top Level: Ancient (3500 BCE - 500 CE)
  {
    id: "seg-ancient",
    name: "Ancient Era",
    startYear: -3500,
    endYear: 500,
    parentSegmentId: null,
    level: 0,
    children: [],
    eventIds: ["evt-001", "evt-002"], // Only key events shown at top level
  },
  // Top Level: Medieval to Industrial (500 - 1900)
  {
    id: "seg-medieval-industrial",
    name: "Medieval to Industrial",
    startYear: 500,
    endYear: 1900,
    parentSegmentId: null,
    level: 0,
    children: [],
    eventIds: ["evt-003", "evt-004", "evt-006", "evt-007"], // Key events
  },
  // Top Level: Modern (1900 - Present)
  {
    id: "seg-modern",
    name: "Modern Era",
    startYear: 1900,
    endYear: 2025,
    parentSegmentId: null,
    level: 0,
    children: [],
    eventIds: ["evt-008", "evt-009", "evt-010"], // Key events
  },
  // Level 1: Early Ancient (drill-down from Ancient)
  {
    id: "seg-early-ancient",
    name: "Early Ancient",
    startYear: -3500,
    endYear: -2000,
    parentSegmentId: "seg-ancient",
    level: 1,
    children: [],
    eventIds: ["evt-001", "evt-002"],
  },
  // Level 1: Medieval (drill-down from Medieval to Industrial)
  {
    id: "seg-medieval",
    name: "Medieval & Renaissance",
    startYear: 500,
    endYear: 1700,
    parentSegmentId: "seg-medieval-industrial",
    level: 1,
    children: [],
    eventIds: ["evt-003", "evt-004", "evt-005"],
  },
  // Level 1: Industrial (drill-down from Medieval to Industrial)
  {
    id: "seg-industrial",
    name: "Industrial Revolution",
    startYear: 1700,
    endYear: 1900,
    parentSegmentId: "seg-medieval-industrial",
    level: 1,
    children: [],
    eventIds: ["evt-006", "evt-007"],
  },
  // Level 1: Early Modern (drill-down from Modern)
  {
    id: "seg-early-modern",
    name: "Early 20th Century",
    startYear: 1900,
    endYear: 1950,
    parentSegmentId: "seg-modern",
    level: 1,
    children: [],
    eventIds: ["evt-008"],
  },
  // Level 1: Contemporary (drill-down from Modern)
  {
    id: "seg-contemporary",
    name: "Digital Age",
    startYear: 1950,
    endYear: 2025,
    parentSegmentId: "seg-modern",
    level: 1,
    children: [],
    eventIds: ["evt-009", "evt-010"],
  },
];

/**
 * Epic 5: Get top-level segments (for initial display)
 */
export function getTopLevelSegments(): TimelineSegment[] {
  return timelineSegments.filter((seg) => seg.level === 0);
}

/**
 * Epic 5: Get child segments for a parent segment
 */
export function getChildSegments(parentId: string): TimelineSegment[] {
  return timelineSegments.filter((seg) => seg.parentSegmentId === parentId);
}

/**
 * Epic 5: Get segment by ID
 */
export function getSegmentById(id: string): TimelineSegment | undefined {
  return timelineSegments.find((seg) => seg.id === id);
}

/**
 * Epic 5: Get events for a specific segment
 */
export function getEventsForSegment(segmentId: string): TimelineEvent[] {
  const segment = getSegmentById(segmentId);
  if (!segment) return [];

  return sampleEvents.filter((event) => segment.eventIds.includes(event.id));
}

/**
 * Epic 5: Get parent segment for a segment
 */
export function getParentSegment(segmentId: string): TimelineSegment | null {
  const segment = getSegmentById(segmentId);
  if (!segment || !segment.parentSegmentId) return null;

  return getSegmentById(segment.parentSegmentId) || null;
}
