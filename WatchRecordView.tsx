import { Text, StyleSheet, TouchableOpacity } from "react-native";

export interface WatchRecord {
  seen: boolean;
  name: string;
}

// Define properties for the component
// The ? means "optional" and means that the attribute can be undefined
// It is the same as:
// record: WatchRecord | undefined
export interface WatchRecordViewProps {
  record?: WatchRecord;
  onSeen?: (record: WatchRecord) => void;
}

export default function WatchRecordView(props: WatchRecordViewProps) {
  const handlePress = () => {
    if (props.onSeen && props.record) {
      props.onSeen(props.record);
    }
  };
  // In the following JSX we use the ? to cause the expression
  // to evaluate to undefined if props.record is undefined instead
  // of throwing an error.
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.recordText}>
        {props.record?.seen ? "[x]" : "[ ]"} {props.record?.name}
      </Text>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  recordText: {
    fontSize: 24,
  },
});
