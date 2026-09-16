export function pack({ category, cluster, clusterName, exam = "CET4", stage = "A2" }, rows) {
  return rows.map((row, i) => {
    const [lemma, ipa, meaning, emoji, example, exampleZh, pos = "n.", roots = []] = row;
    return {
      lemma,
      ipa,
      pos,
      meaning,
      example,
      exampleZh,
      emoji,
      imageHint: meaning,
      categorySlug: category,
      cluster,
      clusterName,
      examLevel: exam,
      stage,
      sortOrder: i,
      rootSlugs: roots,
    };
  });
}

export function dedupe(list) {
  const seen = new Set();
  return list.filter((w) => {
    const key = w.lemma.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
