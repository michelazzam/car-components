import { useRouter } from "next/router";

interface Queries {
  [key: string]: boolean | string | number;
}

export function useQueryStrings() {
  const router = useRouter();

  function appendQueries(queries: Queries) {
    const queriesWithValues: { [key: string]: string } = {};

    for (const [key, value] of Object.entries({
      ...router.query,
      ...queries,
    })) {
      // if exists and the updated value is not empty -> update, else let it be removed
      if (value) queriesWithValues[key] = String(value);
    }

    router.replace(
      { pathname: router.pathname, query: queriesWithValues },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  }

  const resetAllQueries = () => {
    router.replace({ pathname: router.pathname, query: {} }, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  return {
    router,
    currentQueries: router.query,
    appendQueries,
    resetAllQueries,
  };
}
