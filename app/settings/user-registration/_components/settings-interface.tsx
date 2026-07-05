"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SettingsState {
  checkUpdateAtStartup?: boolean
  touchKeyboardEnabledByDefault?: boolean
  roundCashPaymentsTo5Cents?: boolean
  backupAtClosing?: boolean
  identificationBeforeEachSale?: boolean
  managementPanels?: boolean
  keyboardInCapitalActivated?: boolean
  proposeLastDocumentTypeUsed?: boolean
  checkStockAtSale?: boolean
  // endOrderMessage?: string
  includeSalesInInboundHistory?: boolean
  includeSalesByClientInClosure?: boolean
  simplifiedFinancialReport?: boolean
  multiStoreVersionKeepLocalHistory?: boolean
  deleteDataLocallyAfterSentToServer?: boolean
  onSettingUpdate: (settings: {
    checkUpdateAtStartup?: boolean
    touchKeyboardEnabledByDefault?: boolean
    roundCashPaymentsTo5Cents?: boolean
    backupAtClosing?: boolean
    identificationBeforeEachSale?: boolean
    managementPanels?: boolean
    keyboardInCapitalActivated?: boolean
    proposeLastDocumentTypeUsed?: boolean
    checkStockAtSale?: boolean
    // endOrderMessage?: string
    includeSalesInInboundHistory?: boolean
    includeSalesByClientInClosure?: boolean
    simplifiedFinancialReport?: boolean
    multiStoreVersionKeepLocalHistory?: boolean
    deleteDataLocallyAfterSentToServer?: boolean
}) => void
};

const SettingsInterface = ({
checkUpdateAtStartup,
touchKeyboardEnabledByDefault,
roundCashPaymentsTo5Cents,
backupAtClosing,
identificationBeforeEachSale,
managementPanels,
keyboardInCapitalActivated,
proposeLastDocumentTypeUsed,
checkStockAtSale,
// endOrderMessage,
includeSalesInInboundHistory,
includeSalesByClientInClosure,
simplifiedFinancialReport,
multiStoreVersionKeepLocalHistory,
deleteDataLocallyAfterSentToServer,
onSettingUpdate
}: SettingsState) => {
  const [settings, setSettings] = useState<SettingsState>();



  const [backupDrive, setBackupDrive] = useState<string>("DISQUE C:");
  const handleChange = (field: string, value: string | number | boolean) => {
    onSettingUpdate({ [field]: value })
  }
  return (
 <div className="w-full max-w-full mx-auto p-6 ">
        <div className=" max-w-4xl mx-auto p-6 font-sans mb-28 border border-gray-200 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-bold text-lg mb-4">Optional parameters</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Check the Update at startup</span>
              <Switch 
              checked={checkUpdateAtStartup} 
              onCheckedChange={(checked) => handleChange('checkUpdateAtStartup', checked)} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Touch keyboard enabled by default</span>
              <Switch 
              checked={touchKeyboardEnabledByDefault} 
              onCheckedChange={(checked) => handleChange('touchKeyboardEnabledByDefault', checked)} 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700">Arrondir les paiement CASH sur 5 cents</span>
              <Switch 
              checked={roundCashPaymentsTo5Cents} 
              onCheckedChange={(checked) => handleChange('roundCashPaymentsTo5Cents', checked)} 
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <span>Backup at closing on</span>
              <select value={backupDrive} onChange={(e) => setBackupDrive(e.target.value)} className="border border-gray-300 px-2 py-1 w-32">
                <option value="DISQUE C:">DISQUE C:</option>
                <option value="DISQUE D:">DISQUE D:</option>
                <option value="DISQUE E:">DISQUE E:</option>
              </select>
            </div> */}


            {/* ///counter sales */}

            <div>
          <h2 className="font-bold text-lg mb-4">Counter Sales</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Identification before each sale</span>
              <Switch 
              checked={identificationBeforeEachSale} 
              onCheckedChange={(checked) => handleChange('identificationBeforeEachSale', checked)}  
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Management panels</span>
              <Switch               
              checked={managementPanels} 
              onCheckedChange={(checked) => handleChange('managementPanels', checked)}  
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-700">keyboard in Capital activated</span>
              <Switch               
              checked={keyboardInCapitalActivated} 
              onCheckedChange={(checked) => handleChange('keyboardInCapitalActivated', checked)}  
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Proposes the last type of document used</span>
              <Switch               
              checked={proposeLastDocumentTypeUsed} 
              onCheckedChange={(checked) => handleChange('proposeLastDocumentTypeUsed', checked)}  
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Check the stock at the sale</span>
              <Switch               
              checked={checkStockAtSale} 
              onCheckedChange={(checked) => handleChange('checkStockAtSale', checked)}  
              />
            </div>
          
          </div>
        </div>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-4">Stock management</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Include sales in Inbound History</span>
              <Switch               
              checked={includeSalesInInboundHistory} 
              onCheckedChange={(checked) => handleChange('includeSalesInInboundHistory', checked)}  
              />
            </div>
          </div>
          <h2 className="font-bold text-lg mt-6 mb-4">Optional parameters</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Inclure ventes par clients dans clôture</span>
              <Switch               
              checked={includeSalesByClientInClosure} 
              onCheckedChange={(checked) => handleChange('includeSalesByClientInClosure', checked)}  
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Simplified financial report</span>
              <Switch               
              checked={simplifiedFinancialReport} 
              onCheckedChange={(checked) => handleChange('simplifiedFinancialReport', checked)}  
              />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="font-bold text-red-700 mb-1">Multi-store version</h2>
            <p className="text-sm mb-2">Keep a local history</p>
            <div className="flex items-center mb-4">
              <Switch               
              checked={multiStoreVersionKeepLocalHistory} 
              onCheckedChange={(checked) => handleChange('multiStoreVersionKeepLocalHistory', checked)}  
              />
            </div>
            <p className="text-sm italic">
              {deleteDataLocallyAfterSentToServer? 'On': 'Off'}: Data will be deleted locally after being sent to the server
              </p>
          </div>
        </div>
      </div>
    </div>
 </div>
  );
};

export default SettingsInterface;
