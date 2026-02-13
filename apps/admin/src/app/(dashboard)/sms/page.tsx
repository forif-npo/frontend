import { getReceivers } from "./mocks";
import { SmsView } from "./sms-view";

export default async function Page() {
  const receivers = await getReceivers();
  return <SmsView initialReceivers={receivers} />;
}
