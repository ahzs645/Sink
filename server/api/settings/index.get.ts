export default eventHandler(async (event) => {
  const urlMaxLength = await getEffectiveUrlMaxLength(event)

  return {
    urlMaxLength,
  }
})
