/**
 * Sample Events for MVP
 * Provides 8-10 historical events for Epic 2: Timeline Arc Navigation
 * These are hardcoded events to avoid database dependency during initial development
 */

import type { Event } from "@/types";

/**
 * Sample events spanning from ancient history to modern times
 * Each event includes an arcPosition (0-100) representing its position along the timeline arc
 */
export interface TimelineEvent extends Event {
  arcPosition: number; // 0-100, position along the arc curve
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
    content: {
      story: "Around 3500 BCE, someone had a brilliant idea: why not make moving heavy things easier? The wheel changed everything, from carts to pottery wheels to water mills.",
      funFacts: [
        "The oldest wheel was found in Mesopotamia (modern-day Iraq)",
        "Early wheels were made from solid wood",
        "It took 300 years before someone thought to put wheels on chariots!"
      ],
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
    content: {
      story: "The Great Pyramid of Giza is a marvel of ancient engineering. It took about 20 years to build and was the tallest human-made structure for over 3,800 years!",
      funFacts: [
        "It's made of over 2 million stone blocks",
        "Each block weighs about 2.5 tons on average",
        "It was originally covered in smooth white limestone that sparkled in the sun"
      ],
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
    content: {
      story: "Chinese alchemists were trying to create a potion for immortality when they accidentally discovered gunpowder. Instead of living forever, they created something that changed war and gave us fireworks!",
      funFacts: [
        "The recipe was kept secret for centuries",
        "It was used for fireworks before weapons",
        "Gunpowder is made from saltpeter, charcoal, and sulfur"
      ],
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
    content: {
      story: "Before the printing press, books had to be copied by hand. Johannes Gutenberg invented a way to print many copies quickly, making knowledge available to everyone, not just the wealthy.",
      funFacts: [
        "The first printed book was the Gutenberg Bible",
        "It could print about 3,600 pages per day",
        "Before this, a single book could take months to copy by hand"
      ],
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
    content: {
      story: "Galileo didn't invent the telescope, but he made it much better. When he pointed it at the sky, he discovered Jupiter's moons and saw that Earth wasn't the center of the universe!",
      funFacts: [
        "Galileo's telescope could magnify objects 20 times",
        "He discovered four of Jupiter's moons",
        "The Catholic Church didn't like his findings and put him under house arrest"
      ],
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
    content: {
      story: "James Watt didn't invent the steam engine, but he made it so much better that it could power factories, trains, and ships. This kicked off the Industrial Revolution!",
      funFacts: [
        "Steam engines convert heat energy into mechanical work",
        "Watt's name lives on in the 'watt' unit of power",
        "Steam trains could travel up to 30 mph - incredibly fast for the time!"
      ],
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
    content: {
      story: "Many inventors worked on electric lights, but Thomas Edison created one that was practical and long-lasting. No more candles and gas lamps - cities could now light up at night!",
      funFacts: [
        "Edison tested over 3,000 designs before finding the right one",
        "The first successful bulb lasted 13.5 hours",
        "Edison's team also invented the power grid to distribute electricity"
      ],
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
    content: {
      story: "Orville and Wilbur Wright were bicycle mechanics who dreamed of flying. On December 17, 1903, they flew for just 12 seconds - but it was the first controlled, powered flight in history!",
      funFacts: [
        "Their first flight covered only 120 feet - less than a modern plane's wingspan",
        "They made four flights that day, the longest lasting 59 seconds",
        "They had to invent their own lightweight engine"
      ],
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
    content: {
      story: "The first message sent over the internet was supposed to be 'LOGIN' but the system crashed after 'LO'! From this humble start, the internet grew to connect billions of people worldwide.",
      funFacts: [
        "The first internet message was sent on October 29, 1969",
        "Only four computers were connected in the first network",
        "Today, there are over 5 billion internet users worldwide"
      ],
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
    content: {
      story: "When Apple launched the iPhone in 2007, it changed how we communicate, learn, and play. Now we carry powerful computers in our pockets everywhere we go!",
      funFacts: [
        "The first iPhone had only 4GB or 8GB of storage",
        "It couldn't even record video at first",
        "Today's smartphones are more powerful than the computers used in the moon landing"
      ],
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
