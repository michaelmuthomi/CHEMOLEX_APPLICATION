import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Search, Sparkles, DollarSign, ChevronRight } from 'lucide-react-native';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {P, H3, H4, H2} from "~/components/ui/typography";

const categories = [
  {
    id: 1,
    title: "Chillers",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/8/442306416/ZH/AP/PZ/1889348/air-cooled-chillers-1000x1000.png",
    backgroundColor: "#0F4C3A",
  },
  {
    id: 2,
    title: "Air Handling Units",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/4/412323270/DE/RZ/DK/9199886/single-skin-air-handling-unit-1000x1000.png",
    backgroundColor: "#FF6347",
  },
  {
    id: 3,
    title: "Fan coil units",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2023/1/CY/AP/RC/43000247/fan-coil-unit-500x500.png",
    backgroundColor: "#8B8B00",
  },
  {
    id: 4,
    title: "Vrf Multi",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/4/414735525/QN/IM/OK/202996372/misubishi-air-conditioner-500x500.jpg",
    backgroundColor: "#8B4513",
  },
  {
    id: 5,
    title: "Ducted Split system",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2023/9/347250443/OM/QN/BY/9267344/ductable-split-units-1000x1000.jpeg",
    backgroundColor: "#8B4513",
  },
  {
    id: 6,
    title: "Residential",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/4/411112381/TA/TR/IA/202996372/residential-rooftop-packaged-unit-1000x1000.jpg",
    backgroundColor: "#8B4513",
  },
  {
    id: 7,
    title: "Accessories",
    image:
      "http://5.imimg.com/data5/SELLER/Default/2024/3/402772737/YI/CJ/KF/13324667/1-1000x1000.jpg",
    backgroundColor: "#8B4513",
  },
];

export default function SearchScreen({ navigation }:any) {
  return (
    <SafeAreaView className='flex-1 px-4'>
      <View className="flex-row items-center justify-between gap-4 mt-10">
          <Input
            placeholder="Search for product"
            placeholderTextColor="#666"
            className="w-full"
          />
      </View>

      <ScrollView className="pt-4">
        <View>
          <TouchableOpacity style={styles.categoryHeader}>
            <H2 className="uppercase text-xl">Shop by category</H2>
            <ChevronRight size={24} color="#000" />
          </TouchableOpacity>

          <View className='gap-4'>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className='h-40 rounded-md flex-row justify-between px-4'
                style={{ backgroundColor: category.backgroundColor }}
                onPress={() => navigation.navigate('Products', { category })}
              >
                <H4 className="text-xl mt-4">{category.title}</H4>
                <Image
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  featuredCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  categoriesSection: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryImage: {
    width: '80%',
    height: '60%',
    alignSelf: 'flex-end',
  },
});

