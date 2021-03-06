﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="PAH.Index" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="<%=this.Locale()%>" ng-app="app">
<head runat="server">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="<%=this.MaterialResource("angular-material.min.css")%>" />
    <style>
        [ng-cloak] {
            display: none !important;
        }
    </style>
</head>
<body ng-cloak>
    <md-toolbar class="md-hue-2">
        <div class="md-toolbar-tools">
            <md-button ng-click="$pah.toggleMenu()">Menu</md-button>
            <span flex></span>
            <md-button ng-hide="user" ng-click="$pah.login()">Login</md-button>
            <md-button ng-show="user" ng-click="$pah.logout()">
                Logout
                <md-tooltip>Currently logged in as {{user.name}}</md-tooltip>
            </md-button>
        </div>
    </md-toolbar>
    <md-sidenav md-component-id="left" class="md-sidenav-left">
        Left nav
    </md-sidenav>
    <md-content layout="row" layout-padding>
        <ng-view flex></ng-view>
    </md-content>
    <script src="<%=this.AngularResource("angular.min.js")%>"></script>
    <script src="<%=this.AngularLocaleScript()%>"></script>
    <script src="<%=this.AngularResource("angular-route.min.js")%>"></script>
    <script src="<%=this.AngularResource("angular-animate.min.js")%>"></script>
    <script src="<%=this.AngularResource("angular-aria.min.js")%>"></script>
    <script src="<%=this.AngularResource("angular-messages.min.js")%>"></script>
    <script src="<%=this.MaterialResource("angular-material.min.js")%>"></script>
    <script id="pahScript" src="scripts/pah/pah.min.js" data-debug="<%=PAH.Global.AngularDebug%>"></script>
    <script src="scripts/pah/app.min.js"></script>
    <script src="//connect.facebook.net/en_US/sdk.js"></script>
    <script src="//www.youtube.com/iframe_api"></script>
</body>
</html>
