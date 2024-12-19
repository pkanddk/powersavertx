export const logger = {
  info: (message: string, data?: any) => {
    if (data) {
      console.log("\n🔍 ==================== INFO ====================");
      console.log(`${message}:`);
      console.log(JSON.stringify(data, null, 2));
      console.log("===============================================\n");
    } else {
      console.log(`🔍 ${message}`);
    }
  },
  
  error: (message: string, error?: any) => {
    console.error("\n❌ =================== ERROR ===================");
    console.error(message);
    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }
    console.error("===============================================\n");
  },
  
  success: (message: string, data?: any) => {
    console.log("\n✅ ================== SUCCESS ==================");
    console.log(message);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    console.log("===============================================\n");
  },

  raw: (data: any) => {
    console.log("\n📦 =========== RAW API RESPONSE DATA ===========");
    console.log(JSON.stringify(data, null, 2));
    console.log("===============================================\n");
  }
};