const loadScript = (scriptId: string, scriptSrc: string, onLoadCallback: any) => {
  if (document.getElementById(scriptId)) return;

  const script: any = document.createElement("script");
  script.id = scriptId;
  script.rel = "javascript";
  script.src = scriptSrc;

  const scriptFirst = document.getElementsByTagName("script")[0];
  scriptFirst?.parentNode?.insertBefore(script, scriptFirst);

  script.onload = () => {
    onLoadCallback();
  };
};

export { loadScript };
