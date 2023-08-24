export function EnumMap(values: object): number[] {
    return [...Array(1+Math.max(...Object.values(values).map(v => +v).filter(v => +v))).keys()]
}

export enum Statistic {
    Attribute,
    Trait,
    Skill
}

export enum Attribute {
    Strength,
    Body,
    Dexterity,
    Reflexes,
    Intelligence,
    Willpower,
    Charisma,
    Edge
}

export enum Trait {
    AlternativeID,
    Ambidextrous,
    AnimalEmpathy,
    Attractive,
    Citizenship,
    Trueborn,
    CombatSense,
    Connections,
    ExceptionalAttribute,
    FastLearner,
    Fit,
    GTolerance,
    GoodHearing,
    GoodVision,
    Gregariousm,
    Implant,
    Prosthetic,
    NaturalAptitude,
    PainResistance,
    Patient,
    Phenotype,
    PoisonResistance,
    Property,
    Rank,
    SixthSense,
    TechEmpathy,
    ThickSkinned,
    Title,
    Bloodname,
    Toughness,
    AnimalAntipathy,
    Bloodmark,
    CombatParalysis,
    Compulsion,
    DarkSecret,
    Enemy,
    GlassJaw,
    Gremlins,
    Handicap,
    Illiterate,
    Impatient,
    InForLife,
    Introvert,
    LostLimb,
    PoorHearing,
    PoorVision,
    SlowLearner,
    ThinSkinned,
    TDS,
    Unattractive,
    Unlucky,
    Equipped,
    ExtraIncome,
    Reputation,
    Wealth,
    CustomVehicle,
    DesignQuirk,
    VehicleLevel,
    Mutation
}

export enum Skill {
    Acrobatics,
    Acting,
    Administration,
    AnimalHandling,
    Appraisal,
    Archery,
    Art,
    Artillery,
    Career,
    Climbing,
    Communications,
    Computers,
    Cryptography,
    Demolitions,
    Disguise,
    Driving,
    EscapeArtist,
    Forgery,
    Gunnery,
    Interest,
    Interrogation,
    Investigation,
    Language,
    Leadership,
    MartialArts,
    MedTech,
    MeleeWeapons,
    Navigation,
    Negotiation,
    Perception,
    Piloting,
    Prestidigitation,
    Protocol,
    Running,
    Science,
    SecuritySystem,
    SensorOperations,
    SmallArms,
    Stealth,
    Streetwise,
    SupportWeapons,
    Surgery,
    Survival,
    Swimming,
    Tactics,
    Technician,
    ThrownWeapons,
    Tracking,
    Training,
    ZeroGOperations
}

export enum Acrobatics {
    FreeFall,
    Gymnastics
}

export enum AnimalHandling {
    Herding, Riding, Training
}

export enum Communications {
    BlackBox,
    Conventional,
    HyperpuseGenerator
}

export enum Driving {
    Ground, Rail, Sea
}

export enum Gunnery {
    Aerospace, Air, Battlesuit, Ground, Mech, ProtoMech, Sea, Spacecraft, Turret
}

export enum MedTech {
    General, Veterinary
}

export enum Navigation {
    Ground, Air, Sea, Space, KFJump
}

export enum Piloting {
    Aerospace, Aircraft, Battlesuit, Ground, Mech, ProtoMech, Railcraft, Seacraft, Spacecraft
}

export enum Prestidigitation {
    PickPocket, Quickdraw, SleightOfHand
}

export enum SecuritySystem {
    Electrical, Mechanical
}

export enum Surgery {
    General, Veterinary
}

export enum Tactics {
    Infantry, Land, Sea, Air, Space
}

export enum Technician {
    Aeronautics, Cybernetics, Electronics, Jets, Mechanical, Myomer, Nuclear, Weapons
}

export enum ThrownWeapons {
    Blades, Blunt, Spear
}

export enum Tracking {
    Urban, Wilds
}

export type Stage = 0 | 1 | 2 | 3 | 4;

export enum Archtype {
    Noble, Mechwarrior, Infantry, Tanker, Pilot, Explorer, ShipsOfficer, Mercenary, Pirate, Cop, Diplomat, CorpExec, Journalist, Scientist, Engineer, Technician, Academic, Artist, Entertainer, Thug
}

export enum CreatureTrait {
    Aggressive,
    Cognition,
    Armor,
    BloodSucker,
    BloodRage,
    Camoflage,
    ColdBlooded,
    Domesticated,
    ExceptionalAttack,
    Flight,
    GoodHearing,
    GoodSmell,
    GoodVision,
    Hardy,
    NightVision,
    OffensiveAdaptation,
    PackHunter,
    Poisonous,
    PoisonResistance,
    Skittish,
    Susceptible,
    ToolUser,
    CombatSense,
    FastLearner,
    Fit,
    GTolerance,
    PainResistance,
    Patient,
    ThickSkinned,
    Toughness,
    CombatParalysis,
    Compulsion,
    GlassJaw,
    Handicap,
    Impatient,
    LostLimb,
    PoorHearing,
    PoorVision,
    SlowLearner,
    ThinSkinned
}

export enum CreatureSkill {
    Agility,
    Language,
    Melee,
    Mimicry,
    Climbing,
    Perception,
    Running,
    Stealth,
    Swimming,
    Tracking,
    Survival
}

export enum PlantTrait {
    Armor, Camouflage, ExceptionalAttack, Hardy, Poisonous, PoisonResistance, Susceptible
}

export enum PlantSkill {
    Melee, Perception
}

type AttStat
    = Record<'Kind', Statistic.Attribute>
    & Record<'Attribute', Attribute>

type __Skill<S extends Skill> = (Record<'Skill', S> & Record<'Kind', Statistic.Skill>)

type _Skill<S extends Skill> = __Skill<S> &
    ( S extends Skill.Acrobatics ? Record<'Subskill', Acrobatics>
    : S extends Skill.AnimalHandling ? Record<'Subskill', AnimalHandling>
    : S extends Skill.Communications ? Record<'Subskill', Communications>
    : S extends Skill.Driving ? Record<'Subskill', Driving>
    : S extends Skill.Gunnery ? Record<'Subskill', Gunnery>
    : S extends Skill.MedTech ? Record<'Subskill', MedTech>
    : S extends Skill.Navigation ? Record<'Subskill', Navigation>
    : S extends Skill.Piloting ? Record<'Subskill', Piloting>
    : S extends Skill.Prestidigitation ? Record<'Subskill', Prestidigitation>
    : S extends Skill.SecuritySystem ? Record<'Subskill', SecuritySystem>
    : S extends Skill.Surgery ? Record<'Subskill', Surgery>
    : S extends Skill.Tactics ? Record<'Subskill', Tactics>
    : S extends Skill.Technician ? Record<'Subskill', Technician>
    : S extends Skill.ThrownWeapons ? Record<'Subskill', ThrownWeapons>
    : S extends Skill.Tracking ? Record<'Subskill', Tracking>
    : S extends (Skill.Language | Skill.Career | Skill.Protocol | Skill.Streetwise | Skill.Survival | Skill.Art | Skill.Interest) ? (Record<'Subskill', string>)
    : __Skill<S>) 

type SkillStat = _Skill<Skill> & Partial<Record<'Speciality', string>>

type __Trait<T extends Trait> = Record<'Trait', T> & Record<'Kind', Statistic.Trait>

type _Trait<T extends Trait> = __Trait<T> &
    ( T extends Trait.ExceptionalAttribute ? Omit<AttStat, 'Kind'>
    : T extends Trait.NaturalAptitude ? Omit<SkillStat, 'Kind'>
    : T extends Trait.Compulsion ? Record<'Trigger', string>
    : __Trait<T>) 

type TraitStat = _Trait<Trait>

export type Stat = (AttStat | SkillStat | TraitStat)

export type Experience 
    = (Stat | Record<'Or', Stat[]> | Record<'Pick', { Count: number, Options: Stat[] }>) & Record<'Quantity', number>

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>
  
export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

//Year 0 is 2398
export type Eternal = Range<0 , 747>

export enum Book {
    ATimeOfWar,
    ATimeOfWarCompanion,
    EraDigestAgeOfWar,
    EraDigestGoldenCentury,
    EraReport2750,
    EraReport3052,
    EraReport3062,
    EraReport3145,
    HouseArano,
    FieldManual3085
}

export type Citation = Record<'Book', Book> & Record<'Page', Range<0 , 500>>

export type Ops = '>' | '>=' | '=' | '<' | '<=';

type _Requirments 
    = (Stat & Record<'Op', Ops> & Record<'Level', number>)
    | Record<'Or', _Requirments[]>
    | Record<'And', _Requirments[]>
export type Requirment = _Requirments | Record<'Not', _Requirments>

export type OneOrBoth<A, B> = A | B | ( A & B );