import { useCallback, useEffect, useState } from "react";

export default function useIndex() {
  const [index, setIndex] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("animalIndex")) || {};
      return {
        littleKitty: saved.littleKitty ?? saved.cat ?? null,
        misterBear: saved.misterBear ?? saved.bear ?? null,
        madameOwl: saved.madameOwl ?? saved.owl ?? null,
      };
    } catch {
      return { littleKitty: null, misterBear: null, madameOwl: null };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("animalIndex", JSON.stringify(index));
    } catch {
      // Keep tracking this session if storage is unavailable.
    }
  }, [index]);

  const markSeen = useCallback((animal) => {
    setIndex((current) => current[animal] !== null ? current : {
      ...current,
      [animal]: new Date().toLocaleDateString("en-CA"),
    });
  }, []);

  return { index, markSeen };
}
