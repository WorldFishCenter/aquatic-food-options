// lib/photo-map.ts
// Connects adaptation options and their sub-categories to photos in public/photos.
// The "key" is the first 22 letters of the option's title (lower case, letters only),
// so small spelling or punctuation differences in Airtable do not break the match.

// Turns a title into the same kind of key used in the list below.
export function photoKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z]/g, "").slice(0, 22);
}

// key -> file name inside public/photos
const PHOTOS: Record<string, string> = {
  "climateresilientfishst": "01_climate-resilient-fish-strains-and-broodstock.jpg",
  "selectivebreedingforhe": "02_selective-breeding-for-heat-and-disease-toler.jpg",
  "improvedpondwatermanag": "03_improved-pond-water-management.jpg",
  "waterharvestingandstor": "04_water-harvesting-and-storage-systems.jpg",
  "waterefficientaquacult": "05_water-efficient-aquaculture-systems.jpg",
  "climatesmartfarmmanage": "06_climate-smart-farm-management-practices.jpg",
  "improvedfeedingandfeed": "07_improved-feeding-and-feeding-schedule-managem.jpg",
  "polycultureandspeciesd": "09_polyculture-and-species-diversification.jpg",
  "enhancedbiosecurityand": "11_enhanced-biosecurity-and-disease-management.jpg",
  "earlywarningsystems": "13_early-warning-systems.jpg",
  "climateinformationanda": "14_climate-information-and-advisory-services.jpg",
  "disasterresilientaquac": "15_disaster-resilient-aquaculture-infrastructure.jpg",
  "climateresilienthatche": "16_climate-resilient-hatcheries-and-seed-systems.jpg",
  "mangroveaquacultureint": "17_mangrove-aquaculture-integration.jpg",
  "fishhabitatandwetlandr": "18_fish-habitat-and-wetland-restoration.jpg",
  "naturebasedcoastalprot": "19_nature-based-coastal-protection.jpg",
  "adaptivefisheriescoman": "20_adaptive-fisheries-co-management.jpg",
  "ecosystembasedfisherie": "21_ecosystem-based-fisheries-management-ebfm.jpg",
  "climateinformedfisheri": "22_climate-informed-fisheries-and-aquaculture-pl.jpg",
  "climateriskinsurancean": "23_climate-risk-insurance-and-financial-protecti.jpg",
  "accesstoclimatefinance": "24_access-to-climate-finance-and-green-investmen.jpg",
  "digitaldecisionsupport": "26_digital-decision-support-systems-for-aquacult.jpg",
  "remotesensingandgisfor": "27_remote-sensing-and-gis-for-climate-monitoring.jpg",
  "aiiotbasedfarmmonitori": "28_ai-iot-based-farm-monitoring-and-decision-sup.jpg",
  // Current options use the closest subject match, even when a photo is reused.
  "producerorganisationsc": "flickr-social-financial-resilience.jpg",
  "climateresponsiveregul": "22_climate-informed-fisheries-and-aquaculture-pl.jpg",
  "controlledclosedproduc": "05_water-efficient-aquaculture-systems.jpg",
  "aquaticcoastalhabitatr": "18_fish-habitat-and-wetland-restoration.jpg",
  "disasterpreparednessre": "15_disaster-resilient-aquaculture-infrastructure.jpg",
  "postharvestlossreducti": "flickr-value-chain-markets.jpg",
  "accesstocreditsavingsf": "24_access-to-climate-finance-and-green-investmen.jpg",
  "climateinformationserv": "14_climate-information-and-advisory-services.jpg",
  "communityfishrefugespr": "18_fish-habitat-and-wetland-restoration.jpg",
  "climateresilientgeneti": "01_climate-resilient-fish-strains-and-broodstock.jpg",
  "comanagementcommunityb": "20_adaptive-fisheries-co-management.jpg",
  "integratedmultitrophic": "10_integrated-multi-trophic-aquaculture-imta.jpg",
  "aquaticanimalhealthsur": "12_aquatic-animal-health-surveillance-and-diseas.jpg",
  "climatesensitivefoodsa": "11_enhanced-biosecurity-and-disease-management.jpg",
  "farmmonitoringdecision": "26_digital-decision-support-systems-for-aquacult.jpg",
  "heatstressinfrastructu": "15_disaster-resilient-aquaculture-infrastructure.jpg",
  "resilientoffgridenergy": "15_disaster-resilient-aquaculture-infrastructure.jpg",
  "feedfeedingmanagementu": "07_improved-feeding-and-feeding-schedule-managem.jpg",
  "climateresponsiveexten": "flickr-planning-governance-policy.jpg",
  "floodandstormresilient": "15_disaster-resilient-aquaculture-infrastructure.jpg",
  "watershedintegratedwat": "04_water-harvesting-and-storage-systems.jpg",
  "livelihooddiversificat": "25_livelihood-diversification-and-risk-sharing-m.jpg",
  "integratedaquaculturea": "08_integrated-aquaculture-agriculture-iaa.jpg",
  "mangrovesilvoaquacultu": "17_mangrove-aquaculture-integration.jpg",
  "marketdiversificationv": "flickr-value-chain-markets.jpg",
  "nationalclimateimpactm": "27_remote-sensing-and-gis-for-climate-monitoring.jpg",
  "sectorlevelclimatefina": "24_access-to-climate-finance-and-green-investmen.jpg",
  "securetenureaccessrigh": "22_climate-informed-fisheries-and-aquaculture-pl.jpg",
  "waterharvestingstorage": "04_water-harvesting-and-storage-systems.jpg",
  "fishinggeartargetspeci": "20_adaptive-fisheries-co-management.jpg",
  "climateadaptivefisheri": "21_ecosystem-based-fisheries-management-ebfm.jpg",
  "climateadaptivespecies": "02_selective-breeding-for-heat-and-disease-toler.jpg",
  "polycultureproductiond": "09_polyculture-and-species-diversification.jpg",
  "workerheatsafetyprotec": "flickr-social-financial-resilience.jpg",
  "climateresilientseedsy": "16_climate-resilient-hatcheries-and-seed-systems.jpg",
  "resilientfeedinputsupp": "07_improved-feeding-and-feeding-schedule-managem.jpg",
  "locallyledparticipator": "flickr-planning-governance-policy.jpg",
  "shockresponsivesocialp": "flickr-social-financial-resilience.jpg",
  "stockingdensityproduct": "06_climate-smart-farm-management-practices.jpg",
  "mainstreamingaquaticfo": "22_climate-informed-fisheries-and-aquaculture-pl.jpg",
  "pondwaterqualityquanti": "03_improved-pond-water-management.jpg",
  "insurancerisktransfer": "23_climate-risk-insurance-and-financial-protecti.jpg",
  "climateresilientmarket": "flickr-value-chain-markets.jpg",
  "nutritionsensitiveadap": "flickr-value-chain-markets.jpg",
  "climateriskinformedspa": "22_climate-informed-fisheries-and-aquaculture-pl.jpg",
  "farmlevelbiosecurityhe": "11_enhanced-biosecurity-and-disease-management.jpg",
  "farmrelocationproducti": "05_water-efficient-aquaculture-systems.jpg",
};

// These defaults keep future cards useful when a new title has no title-specific match.
const SUBCATEGORY_DEFAULTS: Record<string, string> = {
  geneticspeciesresources: "flickr-genetic-species-resources.jpg",
  onfarmmanagement: "flickr-on-farm-management.jpg",
  productionsystems: "flickr-production-systems.jpg",
  infrastructureenergy: "flickr-infrastructure-energy.jpg",
  valuechainmarkets: "flickr-value-chain-markets.jpg",
  ecosystembasedadaptation: "flickr-ecosystem-based-adaptation.jpg",
  fisheriesmanagement: "flickr-fisheries-management.jpg",
  informationmonitoringdecisionsupport: "flickr-information-monitoring-decision-support.jpg",
  planninggovernancepolicy: "flickr-planning-governance-policy.jpg",
  socialfinancialresilience: "flickr-social-financial-resilience.jpg",
};

function looseKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

// Use a title match first, then a loosely matched sub-category default.
export function photoFor(title: string, subCategory = ""): string | null {
  const file = PHOTOS[photoKey(title)];
  const categoryKey = looseKey(subCategory);
  if (!categoryKey) return file ? `/photos/${file}` : null;
  const defaultFile = Object.entries(SUBCATEGORY_DEFAULTS).find(
    ([key]) => key === categoryKey || key.includes(categoryKey) || categoryKey.includes(key)
  )?.[1];
  return file || defaultFile ? `/photos/${file ?? defaultFile}` : null;
}