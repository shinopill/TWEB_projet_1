/* Return the percentage of use of languages */
function getReposLanguagesStats(reposLanguages = []) {
  const stats = {};
  let totalValue = 0;
  const countLanguages = o => {
    Object.keys(o).forEach(key => {
      const value = o[key];
      const current = stats[key] || 0;
      stats[key] = current + value;
      totalValue += value;
    });
  };
  reposLanguages.forEach(countLanguages);

  Object.keys(stats).forEach(key => {
    stats[key] = ((stats[key] / totalValue) * 100).toFixed(2);
  });

  return stats;
}

module.exports = {
  getReposLanguagesStats,
};
