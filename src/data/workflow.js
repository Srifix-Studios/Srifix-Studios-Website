import { Compass, Cpu, Palette, Rocket } from 'lucide-react'

// Shared content for every "How We Work" variant
export const workflowSteps = [
  {
    step: '01',
    title: 'Discovery & Vision',
    icon: Compass,
    desc: 'Deep-dive into brand architecture, competitive moats, audience psychology, and strategic positioning.',
    deliverables: ['Brand & market audit', 'Audience research', 'Strategy roadmap'],
  },
  {
    step: '02',
    title: 'Art Direction & 3D',
    icon: Palette,
    desc: 'Crafting bespoke typography, 3D assets, high-fidelity wireframes, and fluid micro-interaction systems.',
    deliverables: ['Moodboards & style', 'Wireframes & prototypes', '3D & motion assets'],
  },
  {
    step: '03',
    title: 'Modern Engineering',
    icon: Cpu,
    desc: 'Building responsive WebGL interfaces, buttery smooth animations, and AI-accelerated automated integrations.',
    deliverables: ['Responsive build', 'Animations & WebGL', 'Integrations & automation'],
  },
  {
    step: '04',
    title: 'Launch & Expansion',
    icon: Rocket,
    desc: 'Multi-device performance optimization, SEO infrastructure, analytics tracking, and continuous scaling.',
    deliverables: ['Performance & SEO', 'Analytics setup', 'Ongoing growth support'],
  },
]
