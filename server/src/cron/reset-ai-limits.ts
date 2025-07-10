import cron from "node-cron";
import { prisma } from "../db/db";

// const resetAiCredits = async()=> {
//     let currentDate = new Date();
//  try {
//     const subscriptions = await prisma.subscription.findMany({
//         where:{
//             status:'active',
//             expiryDate:{
//                 lt: currentDate
//             }
//         }
//     });
//     if(!subscriptions || subscriptions.length === 0) return;
//     const updatedSubscriptions = subscriptions.map(sub => {
//         if(!sub.expiryDate) return
//         const nextBilling = new Date(sub.expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000);
//         return prisma.subscription.update({
//             where:{
//                 subscriptionId:sub.subscriptionId
//             },
//             data:{
//                 aiCreditsLeft:100,
//                 nextBillingDate:nextBilling
//             }
//         })
//     })
//     await Promise.all(updatedSubscriptions)
//  } catch (error) {
//     console.log('error resetting credits',error);
    
//  }
// }
cron.schedule("* * * * *",()=>{
    console.log("Running daily credit reset...");

    // await resetAiCredits()
})