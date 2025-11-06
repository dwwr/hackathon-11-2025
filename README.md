# Hackathon 11 2025

## "板前 On The Line: Sushi-ya Tactics"

### (itamae: line cook, sushi-ya: sushi restaurant)

Kyo no thema wa: sushi!

Attention to detail. Sense of urgency. A passion for fresh fish. Do you have what it takes to become a master sushi chef? Team up with a friend to complete orders and sell beautiful dishes, but be careful- your exacting clientele won’t accept mistakes. Success depends on verbal communication, teamwork, and respect between players. Can you quash beef? Can you keep up with the flood of orders, or will you find yourself underwater, swimming with the fishes, in the weeds, or in other words, 86’d? Become the itamae in Itamae On The Line: Sushi-ya Tactics. Allez Cuisine!
We randomly pull from a matrix of ingredients to generate a wide variety of “orders.” The players must execute and sell sushi to the specifications of the order. Money and fame are accumulated or deducted based on performance.

#### Game Loop:

1. Order comes in to Expo
2. Expo reads Order to Cook (huge point- verbal communication is key- there is no other way for the cook to know what to make)
3. the Order must be made in a set amount of time
4. Cook makes the order via a minigame:
   1. in MVP they build the paper doll of the sushi in the correct order, plate it, put it in the window
   2. (huge point- the player must “learn” the menu items visually and by name)
5. Expo validates it:
   1. Ticket says this this and this- is that what’s on the plate?
   2. (huge point again- The players must “learn” the menu items visually and by name)
6. Expo can:
   1. send it out (depending on order accuracy, points can be added or deducted)
   2. tell the Cook to remake it (and handle ensuing argument as timer counts down)
7. time limit might become shorter over time until it is impossible (there is no win state?)

#### Architecture:

1. client - react/phaser app, REST or socket connected to server?
   1. role selection- expo vs cook scenes
   2. how to queue and connect players?
2. server - express boilerplate + sockets
   1. ironically works like a restaurant server IRL
   2. creates order (“rings in the ticket”)
   3. awaits POST with payload (“waits for the food to be made in kitchen”)
   4. tracks points
   5. handles multiple sessions (“tables”)

#### Division of labor:

- asset collection in advance:
  - background images
  - food assets- AC will make these
    - we paperdoll these, z-axis stacking for order assembly
  - audio:
    - different tracks for each player mode?
    - restaurant ambience
    - ticket printer noise when order comes in
    - bell noise when order goes out
    - success/failure noises
- one person does expo mode, the other does cook mode? Or one person does backend, other frontend?
- deployment- JW please help. A queueing system for more than 2 players would be NUTS.
- assets- I’ll ask AC to make SVGs that we can include in the build. Can we ship build with music and png backgrounds included?

#### Beyond MVP:

- more assets, professional-tier UI and elements
- multiple orders & multiple items per order
- queue of orders that build up
  - orders can be addressed in parallel- assembly line food production to save time
  - the cadence can shift so the players move through lulls, into the weeds, and back
- add more food types beyond sashimi/nigiri
- multiple stations for different food types, up to 4 players?
- delegation of duties- eg restocking ingredients or dishes, taking breaks, trading roles, “floating”
