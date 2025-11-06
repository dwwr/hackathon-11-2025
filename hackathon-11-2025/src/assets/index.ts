// Root level assets
import rice from './rice.svg'

// Fish assets
import { default as salmon } from './fish/salmon.svg'
import tamago from './fish/tamago.svg'
import tuna from './fish/tuna.svg'
import white_fish from './fish/white_fish.svg'
import yellowtail from './fish/yellowtail.svg'

// Garnish assets
import ginger from './garnish/ginger.svg'
import momiji from './garnish/momiji.svg'
import ume from './garnish/ume.svg'
import wasabi from './garnish/wasabi.svg'
import yuzu_kosho from './garnish/yuzu_kosho.svg'

// Sauce assets
import aioli from './sauce/aioli.svg'
import soy_sauce from './sauce/soy_sauce.svg'
import sriracha from './sauce/sriracha.svg'

export const assets = {
  rice: rice,
  fish: [salmon, tamago, tuna, white_fish, yellowtail],
  garnish: [ginger, momiji, ume, wasabi, yuzu_kosho],
  sauce: [aioli, soy_sauce, sriracha]
}
