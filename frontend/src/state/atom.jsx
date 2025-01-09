import { atom } from "recoil";

const dataAtom = atom({
  key: "dataAtom",
  default: [],
});

export { dataAtom };
