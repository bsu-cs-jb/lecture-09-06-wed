import { StatusBar } from "expo-status-bar";
import { ReactElement, useState } from "react";
import {
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface WatchRecord {
  seen: boolean;
  name: string;
}

// Define properties for the component
// The ? means "optional" and means that the attribute can be undefined
// It is the same as:
// record: WatchRecord | undefined
interface WatchRecordViewProps {
  record?: WatchRecord;
  onSeen?: (record: WatchRecord) => void;
}

function WatchRecordView(props: WatchRecordViewProps) {
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
      <Text style={styles.labelText}>
        {props.record?.seen ? "[x]" : "[ ]"} {props.record?.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function LectureApp() {
  const [birdInputText, setBirdInputText] = useState("");
  const [submissions, setSubmissions] = useState(0);
  const [cancelations, setCancelations] = useState(0);
  const [watchRecords, setWatchRecords] = useState<WatchRecord[]>([]);

  const handleCancel = () => {
    setBirdInputText("");
    setCancelations(cancelations + 1);
    // hide the keyboard since the user canceled the operation
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    setSubmissions(submissions + 1);
    // remove whitespace from the front and end of the input string
    const newBird = birdInputText.trim();
    if (newBird.length > 0) {
      // create a new array of watch records
      // use the ... splat operator to insert all elements of the current
      // array
      // then add the new WatchRecord object which defaults seen: false
      const updatedWatchRecords: WatchRecord[] = [
        ...watchRecords,
        {
          seen: false,
          name: newBird,
        },
      ];
      // use the new list to set the value of watchRecords
      setWatchRecords(updatedWatchRecords);
      // clear out the input text so the user can enter a new bird easily
      setBirdInputText("");
    }
  };

  const handleLabelChange = (text: string) => {
    setBirdInputText(text);
  };

  const handleSeen = (record: WatchRecord) => {
    // create a new array with updated records
    const updatedWatchRecords = [];
    // search for this entry in the list and update it
    for (const existingRecord of watchRecords) {
      // NOTE: it would be better to compare these based on a unique id
      // rather than using object equality
      if (existingRecord == record) {
        // use the ... splat operator to copy the keys and values from the
        // existingRecord and then toggle the seen boolean
        updatedWatchRecords.push({
          ...existingRecord,
          seen: !existingRecord.seen,
        });
      } else {
        // for all other records, just move them into the new list
        updatedWatchRecords.push(existingRecord);
      }
    }
    // finally use the new list to update watchRecords in order to trigger
    // a re-render of the component
    setWatchRecords(updatedWatchRecords);
  };

  // create an array of ReactElements
  const birdTextComponents: ReactElement[] = [];
  // This method of creating a unique key is NOT RECOMMENDED, but it
  // will work for a simple prototype use case. It will cause problems
  // with other list components such as FlatList and SectionList.
  // The correct solution is to assign a unique id to each WatchRecord
  // when it is created using `nanoid` or `uuid`. I will explain this
  // in a future lesson.
  let index = 0;
  for (const record of watchRecords) {
    birdTextComponents.push(
      <WatchRecordView
        key={`key-${index++}`}
        record={record}
        onSeen={handleSeen}
      />,
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.avoidingView}
    >
      <View style={styles.container}>
        <Text style={styles.titleText}>Bird Watching</Text>
        <Text style={styles.subTitleText}>Make a list, check them off!</Text>
        <ScrollView style={styles.scrollContainer}>
          {birdTextComponents}
        </ScrollView>
        <Text style={styles.labelText}>
          You have submitted {submissions} times(s) and canceled {cancelations}{" "}
          time(s).
        </Text>
        <View style={styles.horzContainer}>
          <Text style={styles.labelText}>Name of bird:</Text>
          <TextInput
            style={styles.input}
            value={birdInputText}
            onChangeText={handleLabelChange}
            onSubmitEditing={handleSubmit}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.horzContainer}>
          <Button title="Cancel" onPress={handleCancel} />
          <View style={styles.flexFill} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}

export const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  input: {
    fontSize: 20,
    flex: 1,
    borderWidth: 1,
    padding: 3,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  titleText: {
    fontSize: 30,
  },
  subTitleText: {
    fontSize: 20,
  },
  labelText: {
    fontSize: 20,
  },
  horzContainer: {
    flexDirection: "row",
    gap: 10,
  },
  topLevelContainer: {
    // Add styles here to affect the outer App component
    // or leave empty if you do not need to change it.
  },
  avoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 5,
  },
});
