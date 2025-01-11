import { atom, selector } from "recoil";

import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const dataAtom = atom({
  key: "dataAtom",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export { dataAtom };
