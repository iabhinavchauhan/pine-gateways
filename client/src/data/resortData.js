export const homestays = [
  {
    slug: 'sakar-homestay',
    name: 'Sakar Homestay',
    location: 'Mairung, Kalimpong',
    tagline: 'A peaceful village home with open cloud views, warm hosting and room to slow down.',
    description:
      'Enjoy a comfortable village stay with mountain views, friendly local hospitality, home-style food and easy access to nearby nature spots.',
    mainImage:
      'https://thepinegetaways.com/images/homestays/mairung.jpg',
    gallery: [],
    rooms: [
      {
        name: 'Forest Suite',
        description: 'A luxury suite with woven fabrics, views over cedar trees, and a private terrace.',
        price: 1500,
      },
      {
        name: 'River View Suite',
        description: 'Soft-light interiors, open-air bathroom, and quiet river sounds after sundown.',
        price: 1700,
      },
    ],
    amenities: ['Private balconies', 'Fireplace seating', 'Organic breakfast', 'Guided forest walk'],
    attractions: ['Tea plantations', 'Sunrise viewpoints', 'Local spice market', 'Birdwatching trails'],
    contact: {
      phone: '+91 98765 43210',
      email: 'stay@samtharhillstay.com',
      whatsapp: '+91 98765 43210',
      address: 'Kalimpong Hills, West Bengal',
    },
    foodHighlights: ['Saffron tea ritual', 'Forest balcony breakfast'],
  },
  {
    slug: 'vivanta-homestay',
    name: 'Vivanta Homestay',
    location: 'Damsang Valley, Kalimpong',
    tagline: 'Valley-facing rooms and wide skies, with a generous lawn for unhurried mornings.',
    description:
      'A scenic valley stay with open lawn, sunrise and sunset outlooks, and quiet natural surroundings for couples and families.',
    mainImage:
      'https://thepinegetaways.com/images/homestays/damsang-valley.png',
    gallery: [],
    rooms: [
      {
        name: 'Meadow Room',
        description: 'A spacious suite with handcrafted wood furniture and natural light throughout.',
        price: 1400,
      },
      {
        name: 'Terrace Room',
        description: 'Private terrace and refined details designed for couples and quiet recollection.',
        price: 1600,
      },
    ],
    amenities: ['Heated floors', 'Evening tea service', 'Private garden', 'Guided village walk'],
    attractions: ['Local pottery village', 'Canyon overlooks', 'Herbal spa treatments', 'Sunset ridge'],
    contact: {
      phone: '+91 98765 43211',
      email: 'hello@suvikshahomestay.com',
      whatsapp: '+91 98765 43211',
      address: 'Misty Valleys, West Bengal',
    },
    foodHighlights: ['Garden brunch', 'Evening tea service'],
  },
  {
    slug: 'green-leaf-homestay',
    name: 'Green Leaf Homestay',
    location: 'Pradhan Gaon, Kalimpong',
    tagline: 'A simple, comfortable village stay tucked among pine trees and forest paths.',
    description:
      'Relax in a cozy village setting surrounded by forest, close to Duka Falls and peaceful walking routes.',
    mainImage:
      'https://thepinegetaways.com/images/homestays/pradhan-gaon.jpg',
    gallery: [],
    rooms: [
      {
        name: 'Cloud Suite',
        description: 'A high-floor suite with panoramic glazing, private lounge, and soft mountain fiber bedding.',
        price: 1800,
      },
      {
        name: 'Garden Suite',
        description: 'A calm suite with direct garden access, natural textures, and a luxurious rain shower.',
        price: 1500,
      },
    ],
    amenities: ['Private dining', 'Yoga terrace', 'Afternoon pastries', 'Nature concierge'],
    attractions: ['Cloud forest trail', 'Tea tasting', 'Secluded waterfall', 'Local monastery'],
    contact: {
      phone: '+91 98765 43212',
      email: 'stay@asherhomestay.com',
      whatsapp: '+91 98765 43212',
      address: 'Emerald Ridge, West Bengal',
    },
    foodHighlights: ['Smoked trout', 'Cedar-spiced desserts'],
  },
]


homestays.forEach((stay) => {
  stay.gallery = [stay.mainImage, ...stay.gallery.filter((image) => image !== stay.mainImage)]
  stay.pricing = { customerDiscounts: [] }
})

export const heroSlides = homestays.map((homestay) => ({
  slug: homestay.slug,
  title: homestay.name,
  subtitle: homestay.tagline,
  description: homestay.description,
  image: homestay.mainImage,
}))

export const featuredRooms = [
  {
    title: 'Forest Suite',
    subtitle: 'Luxury room with private balcony and cedar views.',
    image: 'https://loremflickr.com/1200/800/hotel%20room?random=813f0942',
  },
  {
    title: 'Terrace Room',
    subtitle: 'A calming suite with a terrace, fireplace, and garden outlook.',
    image: 'https://loremflickr.com/1200/800/hotel%20room?random=19c1ebcd',
  },
  {
    title: 'Cloud Suite',
    subtitle: 'Elevated luxury with panoramic mountain views.',
    image: 'https://loremflickr.com/1200/800/mountain%20lodge?random=c4e5397d',
  },
]

export const galleryImages = [
  { src: 'https://loremflickr.com/1200/800/mountain%20cottage?random=8538f477', category: 'Homestays', title: 'Pine lounge retreat' },
  { src: 'https://loremflickr.com/1200/800/hotel%20room?random=168e16ae', category: 'Rooms', title: 'Forest suite interior' },
  { src: 'https://loremflickr.com/1200/800/food?random=a94ed4dc', category: 'Food', title: 'Mountain breakfast spread' },
  { src: 'https://loremflickr.com/1200/800/forest?random=22310209', category: 'Nature', title: 'Cedar forest path' },
  { src: 'https://loremflickr.com/1200/800/forest?random=f1324394', category: 'Experiences', title: 'Sunrise forest walk' },
  { src: 'https://loremflickr.com/1200/800/mountain%20cottage?random=8c1b92e3', category: 'Homestays', title: 'Garden view stay' },
]

export const foodItems = [
  {
    id: 'saffron-himalayan-tea',
    name: 'Saffron Himalayan Tea',
    description: 'A warm, fragrant brew made with local saffron and mountain herbs.',
    type: 'Veg',
    rating: 4.9,
    image: 'https://loremflickr.com/1200/800/food?random=b5738e3e',
    servedAt: ['Sakar Homestay', 'Vivanta Homestay', 'Green Leaf Homestay'],
  },
  {
    id: 'forest-spice-stew',
    name: 'Forest Spice Stew',
    description: 'A rich stew of root vegetables, lentils, and warming Himalayan spices.',
    type: 'Veg',
    rating: 4.8,
    image: 'https://loremflickr.com/1200/800/food?random=ea3bfec4',
    servedAt: ['Sakar Homestay'],
  },
  {
    id: 'cedar-steamed-trout',
    name: 'Cedar-Steamed Trout',
    description: 'Delicate trout steamed over cedar wood with lemon, herbs, and mountain greens.',
    type: 'Non-Veg',
    rating: 4.9,
    image: 'https://loremflickr.com/1200/800/food?random=fc0e52e7',
    servedAt: ['Sakar Homestay'],
  },
  {
    id: 'lotus-rice-pilaf',
    name: 'Lotus Rice Pilaf',
    description: 'A fragrant pilaf with jasmine rice, nuts, dried berries, and gentle spice.',
    type: 'Veg',
    rating: 4.7,
    image: 'https://loremflickr.com/1200/800/food?random=c666679e',
    servedAt: ['Sakar Homestay'],
  },
  {
    id: 'mountain-berry-crisp',
    name: 'Mountain Berry Crisp',
    description: 'Warm berries with a crisp oat topping, served with a spoonful of cream.',
    type: 'Veg',
    rating: 4.6,
    image: 'https://loremflickr.com/1200/800/food?random=02cd9d3e',
    servedAt: ['Sakar Homestay'],
  },
  {
    id: 'herb-noodle-bowl',
    name: 'Herb-Infused Noodle Bowl',
    description: 'Steamed noodles with fresh herbs, crisp vegetables, and a light sesame broth.',
    type: 'Veg',
    rating: 4.7,
    image: 'https://loremflickr.com/1200/800/food?random=02cd9d3e',
    servedAt: ['Vivanta Homestay'],
  },
  {
    id: 'toasted-millet-porridge',
    name: 'Toasted Millet Porridge',
    description: 'Creamy millet porridge with toasted nuts, honey, and warm cinnamon.',
    type: 'Veg',
    rating: 4.6,
    image: 'https://loremflickr.com/1200/800/food?random=4c2013a2',
    servedAt: ['Vivanta Homestay'],
  },
  {
    id: 'ginger-simmered-greens',
    name: 'Ginger-Simmered Greens',
    description: 'Local greens slowly simmered with ginger, garlic, and a hint of mustard seed.',
    type: 'Veg',
    rating: 4.7,
    image: 'https://loremflickr.com/1200/800/food?random=2b0a6d8a',
    servedAt: ['Vivanta Homestay'],
  },
  {
    id: 'smoky-paneer-skewers',
    name: 'Smoky Paneer Skewers',
    description: 'Charred paneer cubes marinated with spices and served with mint chutney.',
    type: 'Veg',
    rating: 4.8,
    image: 'https://loremflickr.com/1200/800/food?random=aa4c4dc7',
    servedAt: ['Vivanta Homestay'],
  },
  {
    id: 'berry-yogurt-parfait',
    name: 'Berry Yogurt Parfait',
    description: 'Layers of creamy yogurt, fresh berries, and crunchy granola.',
    type: 'Veg',
    rating: 4.6,
    image: 'https://loremflickr.com/1200/800/dessert?random=078b025b',
    servedAt: ['Vivanta Homestay'],
  },
  {
    id: 'cloudberry-salad',
    name: 'Cloudberry Salad',
    description: 'A crisp salad of greens, cloudberries, toasted seeds, and citrus dressing.',
    type: 'Veg',
    rating: 4.7,
    image: 'https://loremflickr.com/1200/800/salad?random=1298361f',
    servedAt: ['Green Leaf Homestay'],
  },
  {
    id: 'spiced-lamb-chops',
    name: 'Spiced Lamb Chops',
    description: 'Pan-seared lamb chops with mountain herbs and a smoky glaze.',
    type: 'Non-Veg',
    rating: 4.9,
    image: 'https://loremflickr.com/1200/800/food?random=078b025b',
    servedAt: ['Green Leaf Homestay'],
  },
  {
    id: 'cedar-smoked-fish',
    name: 'Cedar-Smoked Fish',
    description: 'Fillet smoked over cedar, served with lemon and a side of wild greens.',
    type: 'Non-Veg',
    rating: 4.8,
    image: 'https://loremflickr.com/1200/800/seafood?random=89306559',
    servedAt: ['Green Leaf Homestay'],
  },
  {
    id: 'chamomile-panna-cotta',
    name: 'Chamomile Panna Cotta',
    description: 'Silky panna cotta scented with chamomile and topped with honeyed berries.',
    type: 'Veg',
    rating: 4.7,
    image: 'https://loremflickr.com/1200/800/dessert?random=08c6c8a6',
    servedAt: ['Green Leaf Homestay'],
  },
  {
    id: 'wild-mushroom-risotto',
    name: 'Wild Mushroom Risotto',
    description: 'Creamy risotto made with wild mushrooms, fresh herbs, and aged cheese.',
    type: 'Veg',
    rating: 4.8,
    image: 'https://loremflickr.com/1200/800/food?random=02cd9d3e',
    servedAt: ['Green Leaf Homestay'],
  },
]

export const blogPosts = [
  {
    slug: 'samthar-hill-stay-story',
    title: 'SAMTHAR Hill Stay: Morning Rituals, Forest Teas, and the Calm of the Pines',
    category: 'SAMTHAR Hill-Stay',
    excerpt: 'A tranquil account of Samthar’s forest rituals, slow mornings, seasonal cuisine, and gentle hillside luxury.',
    image: 'https://loremflickr.com/1200/800/mountain%20hotel?random=fcbbacfd',
    content: `The story of SAMTHAR Hill Stay begins with dawn light falling through pine boughs, bringing a cool hush across the hilltop. Guests awaken to the scent of cedar and jasmine, and the day begins not with noise but with a gentle call to breathe deeply. A morning ritual here involves a quiet walk along the resort's winding stone path, where the first rays of sun catch dew-misted leaves and the air is filled with birdsong. Along the way, guests pause at the herb garden to gather fresh mint and tulsi, which will be used to brew the signature saffron Himalayan tea.

At breakfast, the table is set with handmade ceramic cups, local honey, and warm chalets of bread infused with rosemary. The cuisine at SAMTHAR is intentionally simple yet richly textured, designed to complement the environment rather than compete with it. Fresh fruits from the hill orchards are served alongside a porridge of toasted millets, crunchy seeds, and a drizzle of wildflower honey. The dining experience becomes a celebration of the region's slow harvests and the hospitality of a place that feels like a second home.

Days at SAMTHAR unfold around secluded spaces and intimate experiences. In the afternoon, guests may choose a guided forest walk to discover hidden streams and traditional villages, or retreat to the private verandah of their room to read and rest. Each suite opens onto a view of rolling hills, and the gentle sound of wind through pines offers a quiet soundtrack for contemplation. The homestay's living room is built for conversation, with wool blankets, soft lighting, and a library of travel journals and local stories.

By evening, the sky over SAMTHAR glows with soft amber and the scent of wood smoke. Dinner is served with a sense of warmth and discovery: cedar-steamed trout with lemon and herbs, a vibrant lotus rice pilaf, and a dessert of berry crisp topped with softly whipped cream. These meals feel like an invitation to slow down, to savor the moment, and to appreciate how every ingredient reflects the surrounding land.

The long-form story of SAMTHAR Hill Stay is more than a description of a place. It is an invitation to experience a hilltop retreat where every detail is chosen to support relaxation, connection, and a deeper sense of calm. From the first tea to the last lantern-lit evening, guests leave with memories of quiet mornings, handcrafted meals, and the peaceful rhythm of nature.`,
  },
  {
    slug: 'suviksha-homestay-story',
    title: 'Suviksha Homestay: Hillside Hospitality, Local Flavors, and Hidden Nature',
    category: 'Suviksha Homestay',
    excerpt: 'A calm story of hillside hospitality, garden-to-table cuisine, and quiet discovery at Suviksha.',
    image: 'https://loremflickr.com/1200/800/forest%20cottage?random=bb2901af',
    content: `Suviksha Homestay is built on a gentle slope where terraced gardens meet a canopy of pines and magnolia. Here, the rhythm of the day is set by natural light and the slow movements of local life. Guests arrive to warm welcomes and fresh mint water, and their first impression is of a home where hospitality flows as naturally as the nearby stream. The homestay's architecture blends timber, stone, and soft fabrics, creating interiors that feel both elegant and grounded in the landscape.

The signature experience at Suviksha begins with a personal introduction to the kitchen garden. Guests are invited to wander among herbs, aromatic flowers, and vegetables, learning how each plant contributes to the menu. The homegrown basil, chives, and coriander are used to craft dishes that are bright and aromatic, while seasonal vegetables are paired with grains that have been toasted slowly over low heat. This connection between garden and plate gives every meal a sense of place.

Afternoons at Suviksha are meant for discovery. A guided walk through nearby tea gardens reveals the soft patterns of green rows and offers expansive views of the valley below. For those seeking quieter moments, the homestay offers a reading nook by a window framed in cedar, as well as a small meditation terrace overlooking the hills. In the evening, the property’s lounge becomes a place for stories: hosts share tales of the local culture, the region's seasonal festivals, and the history of the nearby villages.

Dinner at Suviksha is an invitation to savor local traditions. The herb-infused noodle bowl is served with crisp vegetables and a light sesame broth, while the toasted millet porridge is complemented by roasted nuts and a touch of cinnamon. Each course reflects the care the hosts bring to every detail, making the meal feel deeply nourishing. Dessert arrives as a berry yogurt parfait layered with granola, offering a sweet finish that still feels refreshingly simple.

Suviksha Homestay's long-form story is not just about lodging; it is about the layered experience of staying in a home where every meal, walk, and conversation is rooted in the hillside itself. Guests who linger here remember the soft glow of the evening lamps, the gentle hum of the forest, and the easy feeling of being welcomed into a place that honors both comfort and authenticity.`,
  },
  {
    slug: 'asher-homestay-story',
    title: 'Asher Homestay: Elevated Comfort, Forest Feasts, and Himalayan Moments',
    category: 'Asher Homestay',
    excerpt: 'A rich account of Asher’s elevated forest retreat, Himalayan views, and thoughtfully crafted cuisine.',
    image: 'https://loremflickr.com/1200/800/mountain%20lodge?random=c4e5397d',
    content: `Asher Homestay offers an elevated retreat that balances luxury with the raw beauty of the Himalayan foothills. The property is arranged around a central courtyard, where morning light filters through a canopy of pine and the air carries the scent of fresh cedar. Guests arrive to a calm welcome, their luggage taken gently while they are shown to rooms that open onto terraced gardens and distant ridgelines.

The day at Asher begins with a slow breakfast beneath the open sky. A bowl of cloudberry salad, made with crisp greens, seeds, and citrus dressing, is paired with chamomile panna cotta and warm bread. Each ingredient is chosen to highlight the region's seasonal produce, and the meal is served with a sense of ceremony that makes the simple act of dining feel special. The homestay's culinary philosophy centers on texture, fragrance, and balance, creating plates that are satisfying without overwhelming the senses.

During the day, guests can choose from a range of experiences designed for both rest and adventure. A forest walk through cedar-lined trails reveals hidden viewpoints and quiet streams, while a visit to a nearby village introduces guests to local crafts and tea traditions. Back at the homestay, there are spaces for reflection: a tranquil reading alcove, a terrace with plush seating, and a small cedar sauna that provides warmth after a cool mountain afternoon.

As evening approaches, the property comes alive with light and scent. The dining room fills with the aroma of spiced lamb chops and cedar-smoked fish, each plate arranged with an attention to color and flavor. The meal is accompanied by herbal infusions and a sense of connection, as hosts explain how each recipe honors local ingredients and mountain heritage. Dessert is served with the same care, often a small sweet with fresh berries or honeyed cream.

The story of Asher Homestay is one of thoughtful luxury in a forest setting. It is a place where the rhythm of the day is guided by nature, where culinary moments feel intimate and nourishing, and where guests leave with a sense of having been cared for by both the hosts and the land itself. Each visit becomes a memory of quiet mountain mornings, forest-flavored meals, and the enduring calm of the hills.`,
  },
]

export const initialReviews = []

export const faqs = [
  {
    question: 'Can I book a private guided walk?',
    answer: 'Yes, every homestay offers curated local walks tailored to your pace and interests.',
  },
  {
    question: 'Are meals included with the stay?',
    answer: 'Most bookable packages include breakfast and dinner with seasonal local dishes.',
  },
  {
    question: 'Is there Wi-Fi in the rooms?',
    answer: 'Yes, complimentary Wi-Fi is available throughout the property, while the focus remains on nature and calm.',
  },
]

export const attractions = [
  'Tea garden viewpoints',
  'Riverbank picnic sites',
  'Vintage village market',
  'Cloud forest trails',
]
