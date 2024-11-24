import { useState, useEffect } from 'react';
import { supabase } from './supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

interface CategoryResponse {
  data: Category | null;
  error: Error | null;
  isLoading: boolean;
}

export function useCategory(id: string): CategoryResponse {
  const [data, setData] = useState<Category | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id, name, description, image')
          .eq('id', id)
          .single();

        if (categoryError) throw categoryError;

        // Fetch products for this category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image')
          .eq('category_id', id);

        if (productsError) throw productsError;

        setData({
          ...categoryData,
          products: productsData || []
        });
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred while fetching the category'));
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return { data, error, isLoading };
}
