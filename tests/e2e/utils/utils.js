import LogIn from "../../Pages/LogIn";

const startApp = async (page) => {
  await page.goto('/');
  return new LogIn(page);
};

export default startApp;
