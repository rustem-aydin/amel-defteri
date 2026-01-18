import { MotiView } from "moti";
import { StyleSheet } from "react-native";
import { View } from "../ui/view";
import { CategoryFilterList } from "./CategoryFilterList";
import { StatusFilterList } from "./StatusFilterList";

export const HomeFilter = ({
  categories,
  selectedCat,
  onSelectCat,
  statuses,
  selectedStatus,
  onSelectStatus,
}: any) => (
  <MotiView
    from={{ opacity: 0, translateY: -10 }}
    animate={{ opacity: 1, translateY: 0 }}
    style={styles.filterContainer}
  >
    <StatusFilterList
      statuses={statuses}
      selected={selectedStatus}
      onSelect={onSelectStatus}
      hideCount
    />
    <View style={{ height: 10 }} />
    <CategoryFilterList
      categories={categories}
      selected={selectedCat}
      onSelect={onSelectCat}
    />
  </MotiView>
);

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
});
