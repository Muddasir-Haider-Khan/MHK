import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSiteSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/site-settings', fetcher, {
    revalidateOnFocus: false, // Relies on SSE for real-time updates
  });
  
  return {
    settings: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useHero(pageSlug: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/hero/${pageSlug}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    hero: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useNav() {
  const { data, error, isLoading, mutate } = useSWR('/api/nav', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    navItems: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/profile', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    profile: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useSkills() {
  const { data, error, isLoading, mutate } = useSWR('/api/skills', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    skills: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useExperience() {
  const { data, error, isLoading, mutate } = useSWR('/api/experience', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    experience: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useEducation() {
  const { data, error, isLoading, mutate } = useSWR('/api/education', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    education: data,
    isLoading,
    isError: error,
    mutate
  };
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR('/api/projects', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    projects: data,
    isLoading,
    isError: error,
    mutate
  };
}
