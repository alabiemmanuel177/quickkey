"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestConfigSettings from "./sections/TestConfigSettings";
import UIPreferencesSettings from "./sections/UIPreferencesSettings";
import SoundSettings from "./sections/SoundSettings";
import AccountSettings from "./sections/AccountSettings";

const SettingsPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalize QuickKey</CardTitle>
        <CardDescription>
          Configure your typing test settings, UI preferences, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="test">Test Config</TabsTrigger>
            <TabsTrigger value="ui">UI Preferences</TabsTrigger>
            <TabsTrigger value="sound">Sound</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="mt-6">
            <TestConfigSettings />
          </TabsContent>
          
          <TabsContent value="ui" className="mt-6">
            <UIPreferencesSettings />
          </TabsContent>
          
          <TabsContent value="sound" className="mt-6">
            <SoundSettings />
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsPage; 